import { useContext } from 'react';
import { SymptomCheckerContext } from '../context/SymptomCheckerContext';
import { steps } from '../data/Steps';
import BotMessages from '../utils/BotMessages';

const useInputContext = () => {
  const { patientInfo, startTyping } = useContext(SymptomCheckerContext);

  const processInput = (input, currentStep, patientInfo, suggestions, drugSuggestions) => {
    const inputLower = input.toLowerCase().trim();
    const currentStepConfig = steps.find((step) => step.name === currentStep);

    if (currentStep === 'welcome') {
      if (inputLower === 'start') return { isValid: true, value: 'start' };
      if (inputLower === 'help') {
        startTyping(BotMessages.getHelpMessage());
        return { isValid: false, response: BotMessages.getHelpMessage() };
      }
    } else if (currentStep === 'symptoms' && inputLower === 'done') {
      if ((patientInfo.symptoms || []).length >= 2) {
        return { isValid: true, value: patientInfo.symptoms };
      }
      startTyping('Please provide at least two symptoms before typing "done".');
      return { isValid: false, response: 'Please provide at least two symptoms before typing "done".' };
    } else if ((currentStep === 'riskFactors' || currentStep === 'drugHistory') && (inputLower === 'done' || inputLower === 'none')) {
      return { isValid: true, value: inputLower === 'none' ? [] : patientInfo[currentStep] };
    } else if (currentStep === 'symptoms' && suggestions.length > 0) {
      const matchedSuggestion = suggestions.find((s) => s.text.toLowerCase() === inputLower);
      if (matchedSuggestion) {
        const symptomsToAdd = matchedSuggestion.type === 'combination' ? matchedSuggestion.symptoms : [matchedSuggestion.text];
        return { isValid: true, value: [...(patientInfo.symptoms || []), ...symptomsToAdd] };
      }
    } else if (currentStep === 'drugHistory' && drugSuggestions.length > 0) {
      const matchedDrug = drugSuggestions.find((drug) => drug.toLowerCase() === inputLower);
      if (matchedDrug) {
        return { isValid: true, value: [...(patientInfo.drugHistory || []), matchedDrug] };
      }
    }

    let value = inputLower;
    if (currentStep === 'age' || currentStep === 'duration') {
      const numberMatch = input.match(/\d+/);
      value = numberMatch ? parseInt(numberMatch[0], 10) : null;
    } else if (currentStep === 'gender') {
      value = ['male', 'female', 'other'].find((v) => inputLower.includes(v)) || inputLower;
      value = value ? value.charAt(0).toUpperCase() + value.slice(1) : null;
    } else if (currentStep === 'durationUnit') {
      value = ['days', 'weeks', 'months'].find((v) => inputLower.includes(v)) || inputLower;
      value = value ? value.charAt(0).toUpperCase() + value.slice(1) : null;
    } else if (currentStep === 'severity') {
      value = ['mild', 'moderate', 'severe'].find((v) => inputLower.includes(v)) || inputLower;
      value = value ? value.charAt(0).toUpperCase() + value.slice(1) : null;
    } else if (currentStep === 'travelRegion') {
      value = ['none', ...Object.keys(patientInfo.travelRiskFactors || {})]
        .find((v) => inputLower.includes(v.toLowerCase())) || inputLower;
      value = value ? value.charAt(0).toUpperCase() + value.slice(1) : null;
    } else if (currentStep === 'riskFactors') {
      if (inputLower === 'none') {
        value = [];
      } else {
        const riskMatch = Object.keys(patientInfo.riskFactorWeights || {})
          .find((risk) => inputLower.includes(risk.toLowerCase()));
        value = riskMatch ? [...(patientInfo.riskFactors || []), riskMatch] : null;
      }
    } else if (currentStep === 'drugHistory') {
      value = ['none', ...patientInfo.drugHistoryWeights]
        .find((v) => inputLower.includes(v.toLowerCase())) || inputLower;
      value = value ? value.charAt(0).toUpperCase() + value.slice(1) : null;
    }

    if (value !== null && currentStepConfig?.validate(value, patientInfo.travelRiskFactors, patientInfo.riskFactorWeights, patientInfo.drugHistoryWeights)) {
      return { isValid: true, value };
    }

    const errorResponse = BotMessages.getErrorResponse(currentStep);
    startTyping(errorResponse);
    return { isValid: false, response: errorResponse };
  };

  return { processInput };
};

export default useInputContext;