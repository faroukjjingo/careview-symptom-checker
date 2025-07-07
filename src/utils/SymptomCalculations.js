import { symptomCombinations } from '../data/SymptomCombinations';
import riskFactorWeights from '../data/RiskFactorWeights';
import travelRiskFactors from '../dataTravelRiskFactors';
import drugHistoryWeights from '../data/DrugHistoryWeights';

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.75,
  MEDIUM: 0.5,
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
  const scaledScore = Math.log1p(score) / Math.log1p(maxScore);
  return Math.min(99, Math.max(1, scaledScore * 99));
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
    if (!symptoms || symptoms.length < 2) {
      return { error: 'At least two symptoms are required' };
    }
    if (!duration || isNaN(duration)) {
      return { error: 'Duration must be a valid number' };
    }
    if (!durationUnit || !['days', 'weeks', 'months'].includes(durationUnit.toLowerCase())) {
      return { error: 'Valid duration unit (Days, Weeks, Months) is required' };
    }
    if (!severity || !['mild', 'moderate', 'severe'].includes(severity.toLowerCase())) {
      return { error: 'Severity (Mild, Moderate, Severe) is required' };
    }
    if (!age || isNaN(parseInt(age))) {
      return { error: 'Age must be a valid number' };
    }
    if (!gender || !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return { error: 'Gender (Male, Female, Other) is required' };
    }
    if (!travelRegion || !Object.keys(travelRiskFactors).includes(travelRegion)) {
      return { error: 'Valid travel region is required' };
    }
    if (!drugHistory || !Object.keys(drugHistoryWeights).includes(drugHistory)) {
      return { error: 'Valid drug history is required' };
    }
    if (!Array.isArray(riskFactors)) {
      return { error: 'Risk factors must be an array' };
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
      travelRegion,
      riskFactors,
      drugHistory,
    };

    const diseaseScores = {};
    const unmatchedSymptoms = [];
    const maxPossibleScore = 500;

    const symptomSet = new Set(symptoms);
    let matchedCombination = false;
    for (const comboKey of Object.keys(symptomCombinations)) {
      const comboSymptoms = comboKey.split(', ').map((s) => s.trim());
      const intersection = comboSymptoms.filter((s) => symptomSet.has(s));
      if (intersection.length === comboSymptoms.length) {
        matchedCombination = true;
        const diseases = symptomCombinations[comboKey];
        for (const [disease, weight] of Object.entries(diseases)) {
          diseaseScores[disease] = diseaseScores[disease] || 0;
          const modifiers = calculateModifiers({ weight }, factors);
          diseaseScores[disease] += weight * modifiers * 30;
        }
      } else {
        unmatchedSymptoms.push(...intersection);
      }
    }

    for (const factor of factors.riskFactors) {
      if (riskFactorWeights[factor]) {
        const diseases = riskFactorWeights[factor];
        for (const [disease, weight] of Object.entries(diseases)) {
          diseaseScores[disease] = diseaseScores[disease] || 0;
          diseaseScores[disease] += weight * 5;
        }
      }
    }

    if (factors.travelRegion && travelRiskFactors[factors.travelRegion]) {
      const diseases = travelRiskFactors[factors.travelRegion];
      for (const [disease, weight] of Object.entries(diseases)) {
        diseaseScores[disease] = diseaseScores[disease] || 0;
        diseaseScores[disease] += weight * 5;
      }
    }

    if (factors.drugHistory && drugHistoryWeights[factors.drugHistory]) {
      const diseases = drugHistoryWeights[factors.drugHistory];
      for (const [disease, weight] of Object.entries(diseases)) {
        diseaseScores[disease] = diseaseScores[disease] || 0;
        diseaseScores[disease] += weight * 4;
      }
    }

    const hasRedFlag = symptoms.some((symptom) => redFlagSymptoms.includes(symptom));
    if (hasRedFlag) {
      for (const disease of ['heart attack', 'pulmonary embolism', 'meningitis', 'appendicitis']) {
        if (diseaseScores[disease]) {
          diseaseScores[disease] *= 1.5;
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
          explanation: `Based on symptom combinations, ${factors.riskFactors.length} risk factor(s), travel to ${factors.travelRegion}, and drug history (${factors.drugHistory})`,
        };
      })
      .sort((a, b) => b.probability - a.probability);

    if (!matchedCombination) {
      return {
        detailed: [],
        redFlag: hasRedFlag ? 'Urgent: Seek immediate medical attention due to critical symptoms.' : null,
        unmatchedSymptoms: [...new Set(unmatchedSymptoms)],
        error: 'No valid symptom combinations matched. Ensure symptoms align with known combinations.',
      };
    }

    return {
      detailed: detailed.slice(0, 5),
      redFlag: hasRedFlag ? 'Urgent: Seek immediate medical attention due to critical symptoms.' : null,
      unmatchedSymptoms: [...new Set(unmatchedSymptoms)],
    };
  } catch (error) {
    console.error('Diagnosis error:', error);
    return { error: `Failed to calculate diagnosis: ${error.message}` };
  }
};

export default calculateDiagnosis;
