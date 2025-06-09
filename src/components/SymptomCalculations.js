// calculateDiagnosis.js
import { symptomCombinations } from './SymptomCombinations';
import { symptomWeights } from './SymptomWeights';
import riskFactorWeights from './RiskFactorWeights';
import travelRiskFactors from './TravelRiskFactors';
import drugHistoryWeights from './DrugHistoryWeights';

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
  return Math.min(99, Math.max(1, (score / maxScore) * 99));
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
      return { error: 'At least one symptom is required' };
    }

    const normalizedDuration = normalizeDuration(duration, durationUnit);
    const durationCategory =
      normalizedDuration <= 3 ? 'short' : normalizedDuration <= 14 ? 'medium' : 'long';
    const ageGroup = categorizeAge(age);
    const factors = {
      duration: durationCategory,
      severity: severity.toLowerCase() || 'moderate',
      ageGroup,
      gender: gender.toLowerCase() || 'unknown',
      travelRegion: travelRegion || '',
      riskFactors: riskFactors || [],
      drugHistory: drugHistory || '',
    };

    const diseaseScores = {};
    const unmatchedSymptoms = [];
    const maxPossibleScore = 400;

    // Score individual symptoms
    for (const symptom of symptoms) {
      if (symptomWeights[symptom]) {
        const diseases = symptomWeights[symptom];
        for (const [disease, data] of Object.entries(diseases)) {
          diseaseScores[disease] = diseaseScores[disease] || 0;
          const baseScore = data.weight || 1;
          const modifiers = calculateModifiers(data, factors);
          diseaseScores[disease] += baseScore * modifiers * 10;
        }
      } else {
        unmatchedSymptoms.push(symptom);
      }
    }

    // Score symptom combinations
    const symptomSet = new Set(symptoms);
    for (const comboKey of Object.keys(symptomCombinations)) {
      const comboSymptoms = comboKey.split(', ').map((s) => s.trim());
      const intersection = comboSymptoms.filter((s) => symptomSet.has(s));
      if (intersection.length >= 2) {
        const matchRatio = intersection.length / comboSymptoms.length;
        const diseases = symptomCombinations[comboKey];
        for (const [disease, weight] of Object.entries(diseases)) {
          diseaseScores[disease] = diseaseScores[disease] || 0;
          diseaseScores[disease] += weight * matchRatio * 25;
        }
      }
    }

    // Score risk factors
    for (const factor of factors.riskFactors) {
      if (riskFactorWeights[factor]) {
        const diseases = riskFactorWeights[factor];
        for (const [disease, weight] of Object.entries(diseases)) {
          diseaseScores[disease] = diseaseScores[disease] || 0;
          diseaseScores[disease] += weight * 4;
        }
      }
    }

    // Score travel region
    if (factors.travelRegion && travelRiskFactors[factors.travelRegion]) {
      const diseases = travelRiskFactors[factors.travelRegion];
      for (const [disease, weight] of Object.entries(diseases)) {
        diseaseScores[disease] = diseaseScores[disease] || 0;
        diseaseScores[disease] += weight * 4;
      }
    }

    // Score drug history
    if (factors.drugHistory && drugHistoryWeights[factors.drugHistory]) {
      const diseases = drugHistoryWeights[factors.drugHistory];
      for (const [disease, weight] of Object.entries(diseases)) {
        diseaseScores[disease] = diseaseScores[disease] || 0;
        diseaseScores[disease] += weight * 3;
      }
    }

    // Apply red flag boost
    const hasRedFlag = symptoms.some((symptom) => redFlagSymptoms.includes(symptom));
    if (hasRedFlag) {
      for (const disease of ['heart attack', 'pulmonary embolism', 'meningitis', 'appendicitis']) {
        if (diseaseScores[disease]) {
          diseaseScores[disease] *= 1.4;
        }
      }
    }

    // Generate results
    let detailed = Object.entries(diseaseScores)
      .map(([disease, score]) => {
        const probability = normalizeScore(score, maxPossibleScore) / 100;
        return {
          diagnosis: disease,
          probability: Math.round(probability * 100 * 10) / 10,
          confidence: getConfidenceLevel(probability),
          explanation: `Based on ${symptoms.length} symptom(s), ${factors.riskFactors.length} risk factor(s), and additional factors`,
        };
      })
      .sort((a, b) => b.probability - a.probability);

    // Fallback for single or unmatched symptoms
    if (detailed.length === 0 || Object.keys(diseaseScores).length === 0) {
      detailed = symptoms.flatMap((symptom) => {
        if (symptomWeights[symptom]) {
          return Object.entries(symptomWeights[symptom]).map(([disease, data]) => {
            const score = (data.weight || 1) * calculateModifiers(data, factors) * 10;
            const probability = normalizeScore(score, maxPossibleScore) / 100;
            return {
              diagnosis: disease,
              probability: Math.round(probability * 100 * 10) / 10,
              confidence: getConfidenceLevel(probability),
              explanation: `Based on symptom: ${symptom}`,
            };
          });
        }
        return [];
      });
      detailed = [...new Map(detailed.map((d) => [d.diagnosis, d])).values()]
        .sort((a, b) => b.probability - a.probability);
    }

    // Ensure at least one result
    if (detailed.length === 0) {
      detailed = symptoms.map((symptom) => ({
        diagnosis: 'Possible condition',
        probability: 10,
        confidence: 'Low',
        explanation: `Unrecognized symptom: ${symptom}. Consult a healthcare provider.`,
      }));
    }

    return {
      detailed: detailed.slice(0, 5),
      redFlag: hasRedFlag ? 'Urgent: Seek immediate medical attention due to critical symptoms.' : null,
      unmatchedSymptoms,
    };
  } catch (error) {
    console.error('Diagnosis error:', error);
    return { error: `Failed to calculate diagnosis: ${error.message}` };
  }
};

export default calculateDiagnosis;