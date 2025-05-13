import { symptomCombinations } from './SymptomCombinations';
import { symptomWeights } from './SymptomWeights';
import riskFactorWeights from './RiskFactorWeights';
import travelRiskFactors from './TravelRiskFactors';
import drugHistoryWeights from './DrugHistoryWeights';

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.4,
};

// Red flag symptoms requiring immediate attention
const redFlagSymptoms = [
  'chest pain',
  'shortness of breath',
  'severe headache',
  'sudden vision loss',
  'hemoptysis',
  'severe abdominal pain',
];

// Helper function to normalize duration to days
const normalizeDuration = (duration, unit) => {
  const multipliers = {
    days: 1,
    weeks: 7,
    months: 30,
  };
  return duration * (multipliers[unit.toLowerCase()] || 1);
};

// Helper function to categorize age
const categorizeAge = (age) => {
  const ageNum = parseInt(age);
  if (ageNum <= 12) return 'child';
  if (ageNum <= 18) return 'adolescent';
  if (ageNum <= 65) return 'adult';
  return 'elderly';
};

// Helper function to calculate modifiers
const calculateModifiers = (data, factors) => {
  return (
    (data.durationFactors?.[factors.duration] || 1) *
    (data.severityFactors?.[factors.severity] || 1) *
    (data.ageFactors?.[factors.ageGroup] || 1) *
    (data.genderFactors?.[factors.gender] || 1)
  );
};

// Helper function to normalize scores to 0-100
const normalizeScore = (score, maxScore) => {
  return Math.min(100, Math.max(0, (score / maxScore) * 100));
};

// Helper function to assign confidence level
const getConfidenceLevel = (probability) => {
  if (probability >= CONFIDENCE_THRESHOLDS.HIGH) return 'High';
  if (probability >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
};

const calculateDiagnosis = (
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
    // Input validation
    if (!symptoms || symptoms.length === 0) {
      return { error: 'Please select at least one symptom' };
    }

    // Normalize inputs
    const normalizedDuration = normalizeDuration(duration, durationUnit);
    const durationCategory =
      normalizedDuration <= 3 ? 'short' : normalizedDuration <= 14 ? 'medium' : 'long';
    const ageGroup = categorizeAge(age);
    const factors = {
      duration: durationCategory,
      severity: severity.toLowerCase(),
      ageGroup,
      gender: gender.toLowerCase(),
    };

    // Initialize disease scores
    const diseaseScores = {};
    const matchingFactors = {
      combinationMatches: [],
      symptomMatches: [],
      riskFactorMatches: [],
      travelRiskMatches: [],
      drugHistoryMatches: [],
    };

    // Step 1: Score exact and partial symptom combinations
    const symptomSet = new Set(symptoms);
    const combinationKeys = Object.keys(symptomCombinations);
    let combinationMatchScore = 0;

    for (const comboKey of combinationKeys) {
      const comboSymptoms = comboKey.split(', ').map((s) => s.trim());
      const intersection = comboSymptoms.filter((s) => symptomSet.has(s));
      const matchRatio = intersection.length / comboSymptoms.length;

      if (intersection.length >= Math.min(2, comboSymptoms.length)) {
        const isExactMatch = intersection.length === comboSymptoms.length;
        matchingFactors.combinationMatches.push({
          combination: comboKey,
          matchedSymptoms: intersection,
          isExactMatch,
        });

        const diseases = symptomCombinations[comboKey];
        for (const [disease, weight] of Object.entries(diseases)) {
          if (!diseaseScores[disease]) {
            diseaseScores[disease] = { score: 0, factors: {} };
          }
          // High multiplier for combinations (50), scaled by match ratio
          const comboScore = weight * matchRatio * (isExactMatch ? 50 : 30);
          diseaseScores[disease].score += comboScore;
          diseaseScores[disease].factors[`combo_${comboKey}`] = weight;
          combinationMatchScore += comboScore;
        }
      }
    }

    // Step 2: Score individual symptoms
    let symptomMatchScore = 0;
    for (const symptom of symptoms) {
      if (symptomWeights[symptom]) {
        matchingFactors.symptomMatches.push(symptom);
        const diseases = symptomWeights[symptom];
        for (const [disease, data] of Object.entries(diseases)) {
          if (!diseaseScores[disease]) {
            diseaseScores[disease] = { score: 0, factors: {} };
          }
          const baseScore = data.weight;
          const modifiers = calculateModifiers(data, factors);
          // Lower multiplier for individual symptoms (10)
          const symptomScore = baseScore * modifiers * 10;
          diseaseScores[disease].score += symptomScore;
          diseaseScores[disease].factors[`symptom_${symptom}`] = baseScore;
          symptomMatchScore += symptomScore;
        }
      }
    }

    // Step 3: Apply risk factor weights
    let riskFactorMatchScore = 0;
    if (riskFactors && riskFactors.length) {
      for (const factor of riskFactors) {
        if (riskFactorWeights[factor]) {
          matchingFactors.riskFactorMatches.push(factor);
          const diseases = riskFactorWeights[factor];
          for (const [disease, weight] of Object.entries(diseases)) {
            if (!diseaseScores[disease]) {
              diseaseScores[disease] = { score: 0, factors: {} };
            }
            // Moderate multiplier for risk factors (5)
            const riskScore = weight * 5;
            diseaseScores[disease].score += riskScore;
            diseaseScores[disease].factors[`risk_${factor}`] = weight;
            riskFactorMatchScore += riskScore;
          }
        }
      }
    }

    // Step 4: Apply travel risk weights
    let travelRiskMatchScore = 0;
    if (travelRegion && travelRiskFactors[travelRegion]) {
      matchingFactors.travelRiskMatches.push(travelRegion);
      const diseases = travelRiskFactors[travelRegion];
      for (const [disease, weight] of Object.entries(diseases)) {
        if (!diseaseScores[disease]) {
          diseaseScores[disease] = { score: 0, factors: {} };
        }
        // Moderate multiplier for travel risks (5)
        const travelScore = weight * 5;
        diseaseScores[disease].score += travelScore;
        diseaseScores[disease].factors[`travel_${travelRegion}`] = weight;
        travelRiskMatchScore += travelScore;
      }
    }

    // Step 5: Apply drug history weights
    let drugHistoryMatchScore = 0;
    if (drugHistory && drugHistoryWeights[drugHistory]) {
      matchingFactors.drugHistoryMatches.push(drugHistory);
      const diseases = drugHistoryWeights[drugHistory];
      for (const [disease, weight] of Object.entries(diseases)) {
        if (!diseaseScores[disease]) {
          diseaseScores[disease] = { score: 0, factors: {} };
        }
        // Small multiplier for drug history (3)
        const drugScore = weight * 3;
        diseaseScores[disease].score += drugScore;
        diseaseScores[disease].factors[`drug_${drugHistory}`] = weight;
        drugHistoryMatchScore += drugScore;
      }
    }

    // Step 6: Check for red flag symptoms
    const hasRedFlag = symptoms.some((symptom) => redFlagSymptoms.includes(symptom));

    // Step 7: Normalize and prepare results
    const maxPossibleScore = 1000; // Arbitrary max for normalization
    const detailed = Object.entries(diseaseScores)
      .filter(([_, data]) => data.score > 0)
      .map(([disease, data]) => {
        let score = data.score;
        // Boost red flag diseases if applicable
        const isRedFlagDisease = [
          'heart attack',
          'pulmonary embolism',
          'meningitis',
          'appendicitis',
        ].includes(disease);
        if (hasRedFlag && isRedFlagDisease) {
          score *= 1.5;
        }

        const probability = normalizeScore(score, maxPossibleScore) / 100;
        return {
          diagnosis: disease,
          probability: Math.round(probability * 100 * 10) / 10,
          confidence: getConfidenceLevel(probability),
          matchingFactors: {
            symptomMatch: matchingFactors.symptomMatches.join(', ') || 'None',
            riskFactorMatch: matchingFactors.riskFactorMatches.join(', ') || 'None',
            travelRiskMatch: matchingFactors.travelRiskMatches.join(', ') || 'None',
            drugHistoryMatch: matchingFactors.drugHistoryMatches.join(', ') || 'None',
            combinationMatches: matchingFactors.combinationMatches.map((c) => ({
              combination: c.combination,
              matchedSymptoms: c.matchedSymptoms.join(', '),
              isExactMatch: c.isExactMatch,
            })),
          },
        };
      })
      .sort((a, b) => b.probability - a.probability);

    if (detailed.length === 0) {
      return { error: 'No matching diagnoses found for the given symptoms' };
    }

    return {
      detailed,
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