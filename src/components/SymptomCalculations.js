// calculateDiagnosis.js
import { symptomCombinations } from './SymptomCombinations';
import { symptomWeights } from './SymptomWeights';
import riskFactorWeights from './RiskFactorWeights';
import travelRiskFactors from './TravelRiskFactors';
import drugHistoryWeights from './DrugHistoryWeights';

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.4,
};

const redFlagSymptoms = [
  'chest pain',
  'shortness of breath',
  'severe headache',
  'sudden vision loss',
  'hemoptysis',
  'severe abdominal pain',
];

const normalizeDuration = (duration, unit) => {
  const multipliers = { days: 1, weeks: 7, months: 30 };
  return duration * (multipliers[unit.toLowerCase()] || 1);
};

const categorizeAge = (age) => {
  const ageNum = parseInt(age);
  if (ageNum <= 12) return 'child';
  if (ageNum <= 18) return 'adolescent';
  if (ageNum <= 65) return 'adult';
  return 'elderly';
};

const calculateModifiers = (data, factors) => {
  return (
    (data.durationFactors?.[factors.duration] || 1) *
    (data.severityFactors?.[factors.severity] || 1) *
    (data.ageFactors?.[factors.ageGroup] || 1) *
    (data.genderFactors?.[factors.gender] || 1)
  );
};

const normalizeScore = (score, maxScore) => {
  return Math.min(99, Math.max(0, (score / maxScore) * 99));
};

const getConfidenceLevel = (probability) => {
  if (probability >= CONFIDENCE_THRESHOLDS.HIGH) return 'High';
  if (probability >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
};

const calculateDiagnosis = async (
  symptoms,
  duration,
  durationUnit,
  severity,
  age,
  gender,
  drugHistory,
  travelRegion,
  riskFactors
) => {
  try {
    if (!symptoms || symptoms.length === 0) {
      return { error: 'Please select at least one symptom' };
    }

    const normalizedDuration = normalizeDuration(duration, durationUnit);
    const durationCategory =
      normalizedDuration <= 3 ? 'short' : normalizedDuration <= 14 ? 'medium' : 'long';
    const ageGroup = categorizeAge(age);
    const factors = {
      duration: durationCategory,
      severity: severity.toLowerCase(),
      ageGroup,
      gender: gender.toLowerCase(),
      durationUnit,
      age,
      travelRegion,
      riskFactors: riskFactors || [],
      drugHistory,
    };

    const diseaseScores = {};
    const unmatchedSymptoms = [];
    const maxPossibleScore = 500;

    for (const symptom of symptoms) {
      if (symptomWeights[symptom]) {
        const diseases = symptomWeights[symptom];
        for (const [disease, data] of Object.entries(diseases)) {
          if (!diseaseScores[disease]) {
            diseaseScores[disease] = 0;
          }
          const baseScore = data.weight || 1;
          const modifiers = calculateModifiers(data, factors);
          diseaseScores[disease] += baseScore * modifiers * 5;
        }
      } else {
        unmatchedSymptoms.push(symptom);
      }
    }

    const symptomSet = new Set(symptoms);
    for (const comboKey of Object.keys(symptomCombinations)) {
      const comboSymptoms = comboKey.split(', ').map((s) => s.trim());
      const intersection = comboSymptoms.filter((s) => symptomSet.has(s));
      if (intersection.length >= Math.min(2, comboSymptoms.length)) {
        const matchRatio = intersection.length / comboSymptoms.length;
        const diseases = symptomCombinations[comboKey];
        for (const [disease, weight] of Object.entries(diseases)) {
          if (!diseaseScores[disease]) {
            diseaseScores[disease] = 0;
          }
          diseaseScores[disease] += weight * matchRatio * 20;
        }
      }
    }

    if (riskFactors && riskFactors.length) {
      for (const factor of riskFactors) {
        if (riskFactorWeights[factor]) {
          const diseases = riskFactorWeights[factor];
          for (const [disease, weight] of Object.entries(diseases)) {
            if (!diseaseScores[disease]) {
              diseaseScores[disease] = 0;
            }
            diseaseScores[disease] += weight * 3;
          }
        }
      }
    }

    if (travelRegion && travelRiskFactors[travelRegion]) {
      const diseases = travelRiskFactors[travelRegion];
      for (const [disease, weight] of Object.entries(diseases)) {
        if (!diseaseScores[disease]) {
          diseaseScores[disease] = 0;
        }
        diseaseScores[disease] += weight * 3;
      }
    }

    if (drugHistory && drugHistoryWeights[drugHistory]) {
      const diseases = drugHistoryWeights[drugHistory];
      for (const [disease, weight] of Object.entries(diseases)) {
        if (!diseaseScores[disease]) {
          diseaseScores[disease] = 0;
        }
        diseaseScores[disease] += weight * 2;
      }
    }

    const hasRedFlag = symptoms.some((symptom) => redFlagSymptoms.includes(symptom));
    if (hasRedFlag) {
      for (const disease of ['heart attack', 'pulmonary embolism', 'meningitis', 'appendicitis']) {
        if (diseaseScores[disease]) {
          diseaseScores[disease] *= 1.3;
        }
      }
    }

    let detailed = Object.entries(diseaseScores)
      .map(([disease, score]) => {
        const probability = normalizeScore(score, maxPossibleScore) / 100;
        return {
          diagnosis: disease,
          probability: Math.round(probability * 100 * 10) / 10,
          confidence: getConfidenceLevel(probability),
          explanation: 'Based on symptom and factor analysis',
        };
      })
      .sort((a, b) => b.probability - a.probability);

    if (detailed.length === 0) {
      return { error: 'No diagnoses found; symptom weights may be incomplete' };
    }

    return {
      detailed: detailed.slice(0, 5),
      redFlag: hasRedFlag
        ? 'Urgent: Seek immediate medical attention due to critical symptoms.'
        : null,
    };
  } catch (error) {
    console.error('Calculation error:', error);
    return { error: `Error calculating diagnosis: ${error.message}` };
  }
};

export default calculateDiagnosis;