import { symptomWeights } from './SymptomWeights';
import symptomCombinations from './SymptomCombinations';
import drugHistoryWeights from './DrugHistoryWeights';
import { travelRiskFactors } from './TravelRiskFactors';
import { riskFactorWeights } from './RiskFactorWeights';

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.4
};

/**
 * Calculates diagnosis based on symptoms and other factors
 */
export default function calculateDiagnosis(
  symptoms,
  duration,
  durationUnit,
  severity,
  age,
  gender,
  drugHistory,
  travelRegion,
  riskFactors
) {
  try {
    // Input validation
    if (!symptoms || symptoms.length === 0) {
      return { error: 'Please select at least one symptom' };
    }

    // Normalize duration to days
    const normalizedDuration = normalizeDuration(duration, durationUnit);
    const ageGroup = categorizeAge(age);

    // Calculate scores using both combination and individual approaches
    const diagnosisScores = calculateCompleteScores(symptoms, {
      duration: normalizedDuration,
      severity,
      ageGroup,
      gender
    });

    // Apply additional factor weights
    applyTravelRisks(diagnosisScores, travelRegion);
    applyDrugHistory(diagnosisScores, drugHistory);
    applyRiskFactors(diagnosisScores, riskFactors);

    // Filter out diagnoses with zero scores
    const filteredScores = Object.entries(diagnosisScores)
      .filter(([_, data]) => data.score > 0)
      .reduce((acc, [disease, data]) => {
        acc[disease] = data;
        return acc;
      }, {});

    if (Object.keys(filteredScores).length === 0) {
      return { error: 'No matching diagnoses found for the given symptoms' };
    }

    const results = calculateFinalResults(filteredScores, symptoms, {
      travelRegion,
      riskFactors
    });

    return {
      detailed: results.map(result => ({
        diagnosis: result.disease,
        probability: Math.round(result.probability * 100),
        confidence: getConfidenceLevel(result.probability),
        matchingFactors: {
          symptomMatch: result.factors.symptoms.join(', '),
          riskFactorMatch: result.factors.risks.join(', '),
          travelRiskMatch: result.factors.travel || 'None'
        }
      }))
    };
  } catch (error) {
    console.error('Calculation error:', error);
    return { error: 'Error calculating diagnosis: ' + error.message };
  }
}

/**
 * Calculates complete scores using both combination and individual approaches
 */
function calculateCompleteScores(symptoms, factors) {
  const scores = {};
  
  // First try exact combinations
  const exactMatches = findExactMatches(symptoms);
  if (Object.keys(exactMatches).length > 0) {
    Object.assign(scores, exactMatches);
  }

  // Then try partial combinations
  const partialMatches = findPartialMatches(symptoms);
  mergeScores(scores, partialMatches);

  // Finally, evaluate individual symptoms
  const individualScores = calculateIndividualScores(symptoms, factors);
  mergeScores(scores, individualScores);

  return scores;
}

/**
 * Finds exact matches in symptom combinations
 */
function findExactMatches(symptoms) {
  const sortedSymptoms = symptoms.sort().join(', ');
  if (symptomCombinations[sortedSymptoms]) {
    const matches = {};
    Object.entries(symptomCombinations[sortedSymptoms]).forEach(([disease, weight]) => {
      matches[disease] = {
        score: weight,
        matchingSymptoms: symptoms,
        isExactMatch: true
      };
    });
    return matches;
  }
  return {};
}

/**
 * Finds partial matches in symptom combinations
 */
function findPartialMatches(symptoms) {
  const matches = {};
  const symptomSet = new Set(symptoms);

  Object.entries(symptomCombinations).forEach(([combination, diseases]) => {
    const combinationSymptoms = combination.split(', ');
    const intersection = combinationSymptoms.filter(s => symptomSet.has(s));
    
    if (intersection.length >= Math.min(2, combinationSymptoms.length)) {
      const matchRatio = intersection.length / combinationSymptoms.length;
      
      Object.entries(diseases).forEach(([disease, weight]) => {
        if (!matches[disease]) {
          matches[disease] = {
            score: 0,
            matchingSymptoms: []
          };
        }
        matches[disease].score += weight * matchRatio;
        matches[disease].matchingSymptoms.push(...intersection);
      });
    }
  });

  return matches;
}

/**
 * Calculates scores based on individual symptoms
 */
function calculateIndividualScores(symptoms, factors) {
  const scores = {};
  
  symptoms.forEach(symptom => {
    if (symptomWeights[symptom]) {
      Object.entries(symptomWeights[symptom]).forEach(([disease, data]) => {
        if (!scores[disease]) {
          scores[disease] = {
            score: 0,
            matchingSymptoms: []
          };
        }
        
        const baseScore = data.weight;
        const modifiers = calculateModifiers(data, factors);
        scores[disease].score += baseScore * modifiers;
        scores[disease].matchingSymptoms.push(symptom);
      });
    }
  });

  return scores;
}

/**
 * Merges score objects, combining matching symptoms and adding scores
 */
function mergeScores(target, source) {
  Object.entries(source).forEach(([disease, data]) => {
    if (!target[disease]) {
      target[disease] = {
        score: 0,
        matchingSymptoms: []
      };
    }
    target[disease].score += data.score;
    target[disease].matchingSymptoms = [...new Set([
      ...target[disease].matchingSymptoms,
      ...data.matchingSymptoms
    ])];
  });
}

// [Previous helper functions remain the same]
function normalizeDuration(duration, unit) {
  const multipliers = {
    days: 1,
    weeks: 7,
    months: 30
  };
  return duration * (multipliers[unit] || 1);
}

function categorizeAge(age) {
  const ageNum = parseInt(age);
  if (ageNum <= 12) return 'child';
  if (ageNum <= 18) return 'adolescent';
  if (ageNum <= 65) return 'adult';
  return 'elderly';
}

function calculateModifiers(data, factors) {
  return (
    (data.durationFactors?.[factors.duration] || 1) *
    (data.severityFactors?.[factors.severity] || 1) *
    (data.ageFactors?.[factors.ageGroup] || 1) *
    (data.genderFactors?.[factors.gender] || 1)
  );
}

function applyTravelRisks(scores, region) {
  if (!region || !travelRiskFactors[region]) return;

  Object.entries(travelRiskFactors[region]).forEach(([disease, weight]) => {
    if (!scores[disease]) {
      scores[disease] = { score: 0, matchingSymptoms: [] };
    }
    scores[disease].score += weight;
    scores[disease].travelRisk = region;
  });
}

function applyDrugHistory(scores, drugs) {
  if (!drugs) return;
  
  const drugList = Array.isArray(drugs) ? drugs : [drugs];
  drugList.forEach(drug => {
    if (drugHistoryWeights[drug]) {
      Object.entries(drugHistoryWeights[drug]).forEach(([disease, weight]) => {
        if (!scores[disease]) {
          scores[disease] = { score: 0, matchingSymptoms: [] };
        }
        scores[disease].score += weight;
      });
    }
  });
}

function applyRiskFactors(scores, factors) {
  if (!factors || !factors.length) return;

  factors.forEach(factor => {
    if (riskFactorWeights[factor]) {
      Object.entries(riskFactorWeights[factor]).forEach(([disease, weight]) => {
        if (!scores[disease]) {
          scores[disease] = { score: 0, matchingSymptoms: [] };
        }
        scores[disease].score += weight;
        if (!scores[disease].riskFactors) {
          scores[disease].riskFactors = [];
        }
        scores[disease].riskFactors.push(factor);
      });
    }
  });
}

function calculateFinalResults(scores, symptoms, factors) {
  const totalScore = Object.values(scores).reduce((sum, { score }) => sum + score, 0);
  
  return Object.entries(scores)
    .map(([disease, data]) => ({
      disease,
      probability: totalScore > 0 ? data.score / totalScore : 0,
      factors: {
        symptoms: [...new Set(data.matchingSymptoms)],
        risks: data.riskFactors || [],
        travel: data.travelRisk || null
      }
    }))
    .sort((a, b) => b.probability - a.probability);
}

function getConfidenceLevel(probability) {
  if (probability >= CONFIDENCE_THRESHOLDS.HIGH) return 'High';
  if (probability >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
}
