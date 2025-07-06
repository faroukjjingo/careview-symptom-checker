// src/components/ContextHandler.js
import BotMessages from './BotMessages';

const steps = [
  { name: 'welcome', validate: (value) => ['start', 'help'].includes(value.toLowerCase()) },
  { name: 'gender', validate: (value) => ['Male', 'Female', 'Other'].includes(value) },
  { name: 'symptoms', validate: (value) => typeof value === 'string' && value.trim().length > 0 },
  { name: 'age', validate: (value) => !isNaN(value) && value > 0 && value <= 120 },
  { name: 'duration', validate: (value) => !isNaN(value) && value > 0 },
  { name: 'durationUnit', validate: (value) => ['Days', 'Weeks', 'Months'].includes(value) },
  { name: 'severity', validate: (value) => ['Mild', 'Moderate', 'Severe'].includes(value) },
  { name: 'travelRegion', validate: (value, travelRiskFactors) => [...Object.keys(travelRiskFactors || {}), 'None'].includes(value) },
  { name: 'riskFactors', validate: (value, riskFactorWeights) => Array.isArray(value) && (value.length === 0 || value.every((v) => Object.keys(riskFactorWeights || {}).includes(v))) },
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

  handleContext(input, currentStep, setMessages, addBotMessage, handlePatientInfoChange, setInput, setCurrentStep, patientInfo) {
    const inputLower = input.toLowerCase().trim();
    const currentStepConfig = steps.find((step) => step.name === currentStep);

    // Handle 'start' or 'help' in welcome step
    if (currentStep === 'welcome') {
      if (inputLower === 'start') {
        setCurrentStep('gender');
        addBotMessage(BotMessages.getStepPrompt('gender'));
        setInput('');
        return true;
      } else if (inputLower === 'help') {
        addBotMessage(BotMessages.getHelpMessage());
        setInput('');
        return true;
      }
      addBotMessage(BotMessages.getWelcomeMessage());
      setInput('');
      return true;
    }

    // Handle direct step-specific inputs
    if (currentStepConfig && currentStepConfig.validate) {
      let value = inputLower;
      if (currentStep === 'age' || currentStep === 'duration') {
        const numberMatch = inputLower.match(/\d+/);
        value = numberMatch ? parseInt(numberMatch[0], 10) : null;
      } else if (['gender', 'durationUnit', 'severity'].includes(currentStep)) {
        value = ['male', 'female', 'other', 'days', 'weeks', 'months', 'mild', 'moderate', 'severe']
          .find((v) => inputLower.includes(v)) || value;
        value = value.charAt(0).toUpperCase() + value.slice(1);
      } else if (currentStep === 'travelRegion') {
        value = [...Object.keys(patientInfo.travelRiskFactors || {}), 'none']
          .find((v) => inputLower.includes(v.toLowerCase())) || value;
        value = value.charAt(0).toUpperCase() + value.slice(1);
      } else if (currentStep === 'riskFactors' && (inputLower === 'skip' || inputLower === 'none')) {
        value = [];
      } else if (currentStep === 'riskFactors') {
        const riskMatch = Object.keys(patientInfo.riskFactorWeights || {})
          .find((risk) => inputLower.includes(risk.toLowerCase()));
        if (riskMatch) {
          const currentRiskFactors = patientInfo.riskFactors || [];
          value = currentRiskFactors.includes(riskMatch) ? currentRiskFactors : [...currentRiskFactors, riskMatch];
        }
      } else if (currentStep === 'drugHistory' && (inputLower === 'skip' || inputLower === 'none')) {
        value = 'None';
      } else if (currentStep === 'drugHistory') {
        value = Object.keys(patientInfo.drugHistoryWeights || {})
          .find((drug) => inputLower.includes(drug.toLowerCase())) || value;
      } else if (currentStep === 'submit' && ['submit', 'done', 'finish'].includes(inputLower)) {
        value = true;
      }

      if (value !== null && currentStepConfig.validate(value, patientInfo[currentStep + 'Weights'] || patientInfo.travelRiskFactors)) {
        handlePatientInfoChange(currentStep, value);
        setInput('');
        if (currentStep === 'submit') {
          addBotMessage(BotMessages.getStepPrompt('submit'));
        } else if (currentStep !== 'symptoms' && currentStep !== 'riskFactors') {
          const nextStep = steps[steps.findIndex((s) => s.name === currentStep) + 1]?.name;
          if (nextStep) {
            setCurrentStep(nextStep);
            addBotMessage(BotMessages.getStepPrompt(nextStep));
          }
        } else if (currentStep === 'symptoms') {
          addBotMessage(BotMessages.getSymptomPrompt());
        }
        return true;
      }
    }

    // Handle contextual inputs
    for (const [context, keywords] of Object.entries(ContextHandler.contexts)) {
      if (keywords.some((keyword) => inputLower.includes(keyword))) {
        let response;
        switch (context) {
          case 'greetings':
            response = BotMessages.getGreetingResponse(currentStep);
            break;
          case 'farewells':
            response = BotMessages.getFarewellResponse(currentStep);
            break;
          case 'gratitude':
            response = BotMessages.getGratitudeResponse(currentStep);
            break;
          case 'apologies':
            response = BotMessages.getApologyResponse(currentStep);
            break;
          case 'symptomDescription':
            response = currentStep === 'symptoms' ? BotMessages.getSymptomPrompt() : BotMessages.getSymptomDescriptionResponse(currentStep);
            break;
          case 'durationOfSymptoms':
            response = ['duration', 'durationUnit'].includes(currentStep) ? BotMessages.getStepPrompt(currentStep) : BotMessages.getDurationResponse(currentStep);
            break;
          case 'severityOfSymptoms':
            response = currentStep === 'severity' ? BotMessages.getStepPrompt(currentStep) : BotMessages.getSeverityResponse(currentStep);
            break;
          case 'locationOfSymptoms':
            response = BotMessages.getLocationResponse(currentStep);
            break;
          case 'onset':
            response = BotMessages.getOnsetResponse(currentStep);
            break;
          case 'triggersOrCauses':
            response = BotMessages.getTriggersResponse(currentStep);
            break;
          case 'relievingOrWorseningFactors':
            response = BotMessages.getRelievingWorseningResponse(currentStep);
            break;
          case 'associatedSymptoms':
            response = currentStep === 'symptoms' ? BotMessages.getSymptomPrompt() : BotMessages.getAssociatedSymptomsResponse(currentStep);
            break;
          case 'medicalHistory':
          case 'medicationUse':
            response = currentStep === 'drugHistory' ? BotMessages.getStepPrompt(currentStep) : BotMessages.getMedicationUseResponse(currentStep);
            break;
          case 'allergies':
            response = BotMessages.getAllergiesResponse(currentStep);
            break;
          case 'age':
            response = currentStep === 'age' ? BotMessages.getStepPrompt(currentStep) : BotMessages.getAgeResponse(currentStep);
            break;
          case 'gender':
            response = currentStep === 'gender' ? BotMessages.getStepPrompt(currentStep) : BotMessages.getGenderResponse(currentStep);
            break;
          case 'pregnancyStatus':
            response = BotMessages.getPregnancyResponse(currentStep);
            break;
          case 'lifestyleFactors':
          case 'recentExposure':
            response = currentStep === 'riskFactors' ? BotMessages.getStepPrompt(currentStep) : BotMessages.getLifestyleResponse(currentStep);
            break;
          case 'chronicConditions':
            response = BotMessages.getChronicConditionsResponse(currentStep);
            break;
          case 'familyMedicalHistory':
            response = BotMessages.getFamilyHistoryResponse(currentStep);
            break;
          case 'recentTravel':
            response = currentStep === 'travelRegion' ? BotMessages.getStepPrompt(currentStep) : BotMessages.getRecentTravelResponse(currentStep);
            break;
          case 'vaccinationStatus':
            response = BotMessages.getVaccinationResponse(currentStep);
            break;
          case 'mentalHealthSymptoms':
            response = BotMessages.getMentalHealthResponse(currentStep);
            break;
          case 'requestsForAdvice':
            response = BotMessages.getAdviceResponse(currentStep);
            break;
          case 'requestsForDiagnosis':
            response = BotMessages.getDiagnosisResponse(currentStep);
            break;
          case 'requestsForEmergencyHelp':
            response = BotMessages.getEmergencyResponse(currentStep);
            break;
          case 'confusionOrClarification':
            response = BotMessages.getClarificationResponse(currentStep);
            break;
          case 'feedbackOrComplaints':
            response = BotMessages.getFeedbackResponse(currentStep);
            break;
          default:
            response = BotMessages.getErrorResponse(currentStep);
        }
        addBotMessage(response);
        setInput('');
        return true;
      }
    }

    // Handle symptoms specifically
    if (currentStep === 'symptoms' && inputLower !== 'done') {
      handlePatientInfoChange('symptoms', [...(patientInfo.symptoms || []), inputLower]);
      addBotMessage(BotMessages.getSymptomPrompt());
      setInput('');
      return true;
    }

    // Handle 'done' for symptoms
    if (currentStep === 'symptoms' && inputLower === 'done') {
      if ((patientInfo.symptoms || []).length >= 2) {
        const nextStep = steps[steps.findIndex((s) => s.name === currentStep) + 1]?.name;
        setCurrentStep(nextStep);
        addBotMessage(BotMessages.getStepPrompt(nextStep));
        setInput('');
        return true;
      } else {
        addBotMessage('Please provide at least two symptoms before typing "done".');
        setInput('');
        return true;
      }
    }

    // Fallback for unrecognized input
    addBotMessage(BotMessages.getErrorResponse(currentStep));
    setInput('');
    return true;
  },
};

export default ContextHandler;