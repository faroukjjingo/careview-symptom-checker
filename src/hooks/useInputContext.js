import { useContext } from 'react';
import { SymptomCheckerContext } from '../context/SymptomCheckerContext';
import { steps } from '../data/Steps';
import BotMessages from '../utils/BotMessages';

const useInputContext = () => {
  const { patientInfo, startTyping } = useContext(SymptomCheckerContext);

  const contexts = {
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon'],
    farewells: ['bye', 'goodbye', 'see you', 'later'],
    gratitude: ['thank you', 'thanks', 'appreciate it', 'thx'],
    apologies: ['sorry', 'my bad', 'apologies', 'oops'],
    symptomDescription: ['i feel', 'i have', 'i am', 'it hurts', 'having', 'experiencing'],
    durationOfSymptoms: ['since', 'for', 'days', 'weeks', 'months', 'how long'],
    severityOfSymptoms: ['bad', 'severe', 'mild', 'moderate', 'intense', 'painful'],
    locationOfSymptoms: ['in my', 'on my', 'chest', 'head', 'stomach', 'back', 'leg', 'arm'],
    onset: ['sudden', 'gradual', 'started', 'began', 'came on'],
    triggersOrCauses: ['triggered by', 'caused by', 'because of', 'after', 'when i'],
    relievingOrWorseningFactors: ['better when', 'worse when', 'relieved by', 'improves with', 'worsens with'],
    associatedSymptoms: ['also have', 'and i', 'with a', 'along with'],
    medicalHistory: ['history of', 'i had', 'past medical', 'previously diagnosed'],
    medicationUse: ['taking', 'on', 'medication', 'prescribed', 'medicine'],
    allergies: ['allergic to', 'allergy', 'allergies'],
    age: ['i am', 'years old', 'age is', 'i’m'],
    gender: ['i am', 'male', 'female', 'other'],
    pregnancyStatus: ['pregnant', 'expecting', 'pregnancy'],
    lifestyleFactors: ['smoke', 'drink', 'alcohol', 'exercise', 'diet'],
    chronicConditions: ['chronic', 'long term', 'ongoing', 'condition'],
    familyMedicalHistory: ['family history', 'my family', 'runs in the family'],
    recentTravel: ['traveled to', 'been to', 'visited', 'travel'],
    recentExposure: ['exposed to', 'around', 'contact with', 'near'],
    vaccinationStatus: ['vaccinated', 'vaccine', 'shots', 'immunized'],
    mentalHealthSymptoms: ['anxious', 'depressed', 'stress', 'mood', 'mental'],
    requestsForAdvice: ['what should i do', 'advice', 'recommend', 'suggest'],
    requestsForDiagnosis: ['what’s wrong', 'diagnose', 'what is it', 'what’s the problem'],
    requestsForEmergencyHelp: ['emergency', 'urgent', 'help now', 'serious'],
    confusionOrClarification: ['what', 'huh', 'explain', 'clarify', 'don’t understand'],
    feedbackOrComplaints: ['this is', 'not working', 'issue', 'problem', 'sucks'],
  };

  const contextResponseMap = {
    greetings: BotMessages.getGreetingResponse,
    farewells: BotMessages.getFarewellResponse,
    gratitude: BotMessages.getGratitudeResponse,
    apologies: BotMessages.getApologyResponse,
    symptomDescription: BotMessages.getSymptomDescriptionResponse,
    durationOfSymptoms: BotMessages.getDurationResponse,
    severityOfSymptoms: BotMessages.getSeverityResponse,
    locationOfSymptoms: BotMessages.getLocationResponse,
    onset: BotMessages.getOnsetResponse,
    triggersOrCauses: BotMessages.getTriggersResponse,
    relievingOrWorseningFactors: BotMessages.getRelievingWorseningResponse,
    associatedSymptoms: BotMessages.getAssociatedSymptomsResponse,
    medicalHistory: BotMessages.getMedicalHistoryResponse,
    medicationUse: BotMessages.getMedicationUseResponse,
    allergies: BotMessages.getAllergiesResponse,
    age: BotMessages.getAgeResponse,
    gender: BotMessages.getGenderResponse,
    pregnancyStatus: BotMessages.getPregnancyResponse,
    lifestyleFactors: BotMessages.getLifestyleResponse,
    chronicConditions: BotMessages.getChronicConditionsResponse,
    familyMedicalHistory: BotMessages.getFamilyHistoryResponse,
    recentTravel: BotMessages.getRecentTravelResponse,
    recentExposure: BotMessages.getRecentExposureResponse,
    vaccinationStatus: BotMessages.getVaccinationResponse,
    mentalHealthSymptoms: BotMessages.getMentalHealthResponse,
    requestsForAdvice: BotMessages.getAdviceResponse,
    requestsForDiagnosis: BotMessages.getDiagnosisResponse,
    requestsForEmergencyHelp: BotMessages.getEmergencyResponse,
    confusionOrClarification: BotMessages.getClarificationResponse,
    feedbackOrComplaints: BotMessages.getFeedbackResponse,
  };

  const processInput = (input, currentStep, patientInfo, suggestions, drugSuggestions) => {
    const inputLower = input.toLowerCase().trim();
    const currentStepConfig = steps.find((step) => step.name === currentStep);

    console.log(`Processing input: ${inputLower} for step: ${currentStep}`); // Debug log

    if (currentStep === 'welcome') {
      if (inputLower === 'start') return { isValid: true, value: 'start' };
      if (inputLower === 'help') {
        const response = BotMessages.getHelpMessage();
        startTyping(response);
        return { isValid: false, response };
      }
      const response = BotMessages.getInvalidWelcomeMessage();
      startTyping(response);
      return { isValid: false, response };
    } else if ((currentStep === 'symptoms' || currentStep === 'riskFactors') && inputLower === 'done') {
      if ((patientInfo[currentStep] || []).length >= 2) {
        console.log(`Completing ${currentStep} with value: ${JSON.stringify(patientInfo[currentStep])}`); // Debug log
        return { isValid: true, value: patientInfo[currentStep] };
      }
      const response = `Please provide at least two ${currentStep} before typing 'done'.`;
      startTyping(response);
      return { isValid: false, response };
    } else if ((currentStep === 'symptoms' || currentStep === 'riskFactors' || currentStep === 'drugHistory') && inputLower === 'none') {
      console.log(`Completing ${currentStep} with value: []`); // Debug log
      return { isValid: true, value: [] };
    } else if (currentStep === 'symptoms' && suggestions.length > 0) {
      const matchedSuggestion = suggestions.find((s) => s.text.toLowerCase() === inputLower);
      if (matchedSuggestion) {
        const symptomsToAdd = matchedSuggestion.type === 'combination' ? matchedSuggestion.symptoms : [matchedSuggestion.text];
        console.log(`Adding symptoms: ${symptomsToAdd}`); // Debug log
        return { isValid: true, value: [...(patientInfo.symptoms || []), ...symptomsToAdd] };
      }
    } else if (currentStep === 'riskFactors' && suggestions.length > 0) {
      const matchedSuggestion = suggestions.find((s) => s.text.toLowerCase() === inputLower);
      if (matchedSuggestion) {
        const riskFactorsToAdd = matchedSuggestion.type === 'combination' ? matchedSuggestion.riskFactors : [matchedSuggestion.text];
        console.log(`Adding risk factors: ${riskFactorsToAdd}`); // Debug log
        return { isValid: true, value: [...(patientInfo.riskFactors || []), ...riskFactorsToAdd] };
      }
    } else if (currentStep === 'drugHistory' && drugSuggestions.length > 0) {
      const matchedDrugs = drugSuggestions
        .filter((drug) => drug.toLowerCase().includes(inputLower))
        .slice(0, 5); // Limit to top 5 matches
      if (matchedDrugs.length > 0) {
        const matchedDrug = matchedDrugs.find((drug) => drug.toLowerCase() === inputLower);
        if (matchedDrug) {
          console.log(`Adding drug: ${matchedDrug}`); // Debug log
          return { isValid: true, value: [...(patientInfo.drugHistory || []), matchedDrug] };
        }
        console.log(`No exact match, suggesting: ${matchedDrugs}`); // Debug log
        return { isValid: false, response: `Did you mean one of these? ${matchedDrugs.join(', ')}` };
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
    }

    console.log(`Validated value for ${currentStep}: ${value}`); // Debug log

    if (value !== null && currentStepConfig?.validate(value, patientInfo.travelRiskFactors, patientInfo.riskFactorWeights, patientInfo.drugHistoryWeights)) {
      return { isValid: true, value };
    }

    for (const [context, keywords] of Object.entries(contexts)) {
      if (keywords.some((keyword) => inputLower.includes(keyword))) {
        const response = contextResponseMap[context](currentStep);
        startTyping(response);
        return { isValid: false, response };
      }
    }

    const errorResponse = BotMessages.getErrorResponse(currentStep);
    startTyping(errorResponse);
    return { isValid: false, response: errorResponse };
  };

  return { processInput };
};

export default useInputContext;