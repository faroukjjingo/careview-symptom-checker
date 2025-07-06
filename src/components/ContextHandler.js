// src/components/ContextHandler.js
import BotMessages from './BotMessages';

const steps = [
  { name: 'gender', validate: (value) => ['Male', 'Female', 'Other'].includes(value) },
  { name: 'symptoms', validate: (value) => typeof value === 'string' && value.trim().length > 0 },
  { name: 'age', validate: (value) => !isNaN(value) && value > 0 && value <= 120 },
  { name: 'duration', validate: (value) => !isNaN(value) && value > 0 },
  { name: 'durationUnit', validate: (value) => ['Days', 'Weeks', 'Months'].includes(value) },
  { name: 'severity', validate: (value) => ['Mild', 'Moderate', 'Severe'].includes(value) },
  { name: 'travelRegion', validate: (value, travelRiskFactors) => [...Object.keys(travelRiskFactors || {}), 'None'].includes(value) },
  { name: 'riskFactors', validate: (value, riskFactorWeights) => Array.isArray(value) && value.every((v) => Object.keys(riskFactorWeights || {}).includes(v)) },
  { name: 'drugHistory', validate: (value, drugHistoryWeights) => ['None', ...Object.keys(drugHistoryWeights || {})].includes(value) },
  { name: 'submit', validate: () => true },
];

const ContextHandler = {
  contexts: {
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
  },

  handleContext(input, currentStep, setMessages, addBotMessage, handlePatientInfoChange, setInput, patientInfo) {
    const inputLower = input.toLowerCase().trim();
    const currentStepConfig = steps.find((step) => step.name === currentStep);

    for (const [context, keywords] of Object.entries(ContextHandler.contexts)) {
      if (keywords.some((keyword) => inputLower.includes(keyword))) {
        switch (context) {
          case 'greetings':
            addBotMessage(BotMessages.getGreetingResponse(currentStep));
            setInput('');
            return true;
          case 'farewells':
            addBotMessage(BotMessages.getFarewellResponse(currentStep));
            setInput('');
            return true;
          case 'gratitude':
            addBotMessage(BotMessages.getGratitudeResponse(currentStep));
            setInput('');
            return true;
          case 'apologies':
            addBotMessage(BotMessages.getApologyResponse(currentStep));
            setInput('');
            return true;
          case 'symptomDescription':
            if (currentStep === 'symptoms') {
              addBotMessage(BotMessages.getSymptomPrompt());
              setInput('');
              return true;
            }
            addBotMessage(BotMessages.getSymptomDescriptionResponse(currentStep));
            setInput('');
            return true;
          case 'durationOfSymptoms':
            if (currentStep === 'duration' || currentStep === 'durationUnit') {
              addBotMessage(BotMessages.getStepPrompt(currentStep));
              setInput('');
              return true;
            }
            addBotMessage(BotMessages.getDurationResponse(currentStep));
            setInput('');
            return true;
          case 'severityOfSymptoms':
            if (currentStep === 'severity') {
              addBotMessage(BotMessages.getStepPrompt(currentStep));
              setInput('');
              return true;
            }
            addBotMessage(BotMessages.getSeverityResponse(currentStep));
            setInput('');
            return true;
          case 'locationOfSymptoms':
            addBotMessage(BotMessages.getLocationResponse(currentStep));
            setInput('');
            return true;
          case 'onset':
            addBotMessage(BotMessages.getOnsetResponse(currentStep));
            setInput('');
            return true;
          case 'triggersOrCauses':
            addBotMessage(BotMessages.getTriggersResponse(currentStep));
            setInput('');
            return true;
          case 'relievingOrWorseningFactors':
            addBotMessage(BotMessages.getRelievingWorseningResponse(currentStep));
            setInput('');
            return true;
          case 'associatedSymptoms':
            if (currentStep === 'symptoms') {
              addBotMessage(BotMessages.getSymptomPrompt());
              setInput('');
              return true;
            }
            addBotMessage(BotMessages.getAssociatedSymptomsResponse(currentStep));
            setInput('');
            return true;
          case 'medicalHistory':
          case 'medicationUse':
            if (currentStep === 'drugHistory') {
              if (inputLower === 'skip' || inputLower === 'none') {
                handlePatientInfoChange('drugHistory', 'None');
                setInput('');
                return true;
              }
              const drugMatch = Object.keys(patientInfo.drugHistoryWeights || {}).find((drug) =>
                inputLower.includes(drug.toLowerCase())
              );
              if (drugMatch && currentStepConfig.validate(drugMatch, patientInfo.drugHistoryWeights)) {
                handlePatientInfoChange('drugHistory', drugMatch);
                setInput('');
                return true;
              }
              addBotMessage(BotMessages.getStepPrompt(currentStep));
              setInput('');
              return true;
            }
            addBotMessage(BotMessages.getMedicationUseResponse(currentStep));
            setInput('');
            return true;
          case 'allergies':
            addBotMessage(BotMessages.getAllergiesResponse(currentStep));
            setInput('');
            return true;
          case 'age':
            if (currentStep === 'age') {
              const ageMatch = inputLower.match(/\d+/);
              if (ageMatch && currentStepConfig.validate(parseInt(ageMatch[0], 10))) {
                handlePatientInfoChange('age', parseInt(ageMatch[0], 10));
                setInput('');
                return true;
              }
            }
            addBotMessage(BotMessages.getAgeResponse(currentStep));
            setInput('');
            return true;
          case 'gender':
            if (currentStep === 'gender') {
              const genderMatch = ['male', 'female', 'other'].find((g) => inputLower.includes(g));
              if (genderMatch && currentStepConfig.validate(genderMatch.charAt(0).toUpperCase() + genderMatch.slice(1))) {
                handlePatientInfoChange('gender', genderMatch.charAt(0).toUpperCase() + genderMatch.slice(1));
                setInput('');
                return true;
              }
            }
            addBotMessage(BotMessages.getGenderResponse(currentStep));
            setInput('');
            return true;
          case 'pregnancyStatus':
            addBotMessage(BotMessages.getPregnancyResponse(currentStep));
            setInput('');
            return true;
          case 'lifestyleFactors':
          case 'recentExposure':
            if (currentStep === 'riskFactors') {
              if (inputLower === 'skip' || inputLower === 'none') {
                handlePatientInfoChange('riskFactors', []);
                setInput('');
                return true;
              }
              const riskMatch = Object.keys(patientInfo.riskFactorWeights || {}).find((risk) =>
                inputLower.includes(risk.toLowerCase())
              );
              if (riskMatch && currentStepConfig.validate([riskMatch], patientInfo.riskFactorWeights)) {
                const currentRiskFactors = patientInfo.riskFactors || [];
                const updatedRiskFactors = currentRiskFactors.includes(riskMatch)
                  ? currentRiskFactors
                  : [...currentRiskFactors, riskMatch];
                handlePatientInfoChange('riskFactors', updatedRiskFactors);
                setInput('');
                return true;
              }
              addBotMessage(BotMessages.getStepPrompt(currentStep));
              setInput('');
              return true;
            }
            addBotMessage(BotMessages.getLifestyleResponse(currentStep));
            setInput('');
            return true;
          case 'chronicConditions':
            addBotMessage(BotMessages.getChronicConditionsResponse(currentStep));
            setInput('');
            return true;
          case 'familyMedicalHistory':
            addBotMessage(BotMessages.getFamilyHistoryResponse(currentStep));
            setInput('');
            return true;
          case 'recentTravel':
            if (currentStep === 'travelRegion') {
              const travelMatch = [...Object.keys(patientInfo.travelRiskFactors || {}), 'none'].find((region) =>
                inputLower.includes(region.toLowerCase())
              );
              if (travelMatch && currentStepConfig.validate(travelMatch.charAt(0).toUpperCase() + travelMatch.slice(1), patientInfo.travelRiskFactors)) {
                handlePatientInfoChange('travelRegion', travelMatch.charAt(0).toUpperCase() + travelMatch.slice(1));
                setInput('');
                return true;
              }
              addBotMessage(BotMessages.getStepPrompt(currentStep));
              setInput('');
              return true;
            }
            addBotMessage(BotMessages.getRecentTravelResponse(currentStep));
            setInput('');
            return true;
          case 'vaccinationStatus':
            addBotMessage(BotMessages.getVaccinationResponse(currentStep));
            setInput('');
            return true;
          case 'mentalHealthSymptoms':
            addBotMessage(BotMessages.getMentalHealthResponse(currentStep));
            setInput('');
            return true;
          case 'requestsForAdvice':
            addBotMessage(BotMessages.getAdviceResponse(currentStep));
            setInput('');
            return true;
          case 'requestsForDiagnosis':
            addBotMessage(BotMessages.getDiagnosisResponse(currentStep));
            setInput('');
            return true;
          case 'requestsForEmergencyHelp':
            addBotMessage(BotMessages.getEmergencyResponse(currentStep));
            setInput('');
            return true;
          case 'confusionOrClarification':
            addBotMessage(BotMessages.getClarificationResponse(currentStep));
            setInput('');
            return true;
          case 'feedbackOrComplaints':
            addBotMessage(BotMessages.getFeedbackResponse(currentStep));
            setInput('');
            return true;
          default:
            return false;
        }
      }
    }

    // Handle direct input for specific steps
    if (currentStep === 'submit' && ['submit', 'done', 'finish'].includes(inputLower)) {
      handlePatientInfoChange('submit', true);
      setInput('');
      return true;
    }

    if (currentStepConfig && currentStepConfig.validate) {
      let value = inputLower;
      if (currentStep === 'age' || currentStep === 'duration') {
        const numberMatch = inputLower.match(/\d+/);
        value = numberMatch ? parseInt(numberMatch[0], 10) : null;
      } else if (['gender', 'durationUnit', 'severity', 'travelRegion'].includes(currentStep)) {
        value = inputLower.charAt(0).toUpperCase() + inputLower.slice(1);
      } else if (currentStep === 'riskFactors' && (inputLower === 'skip' || inputLower === 'none')) {
        value = [];
      } else if (currentStep === 'drugHistory' && (inputLower === 'skip' || inputLower === 'none')) {
        value = 'None';
      }

      if (value !== null && currentStepConfig.validate(value, patientInfo[currentStep + 'Weights'] || patientInfo.travelRiskFactors)) {
        handlePatientInfoChange(currentStep, value);
        setInput('');
        return true;
      }
    }

    addBotMessage(BotMessages.getErrorResponse(currentStep));
    setInput('');
    return true;
  },
};

export default ContextHandler;