// src/components/ContextHandler.js
import BotMessages from './BotMessages';

// Define steps within ContextHandler to avoid undefined error
const steps = [
  { name: 'welcome', validate: (value) => ['start', 'help'].includes(value.toLowerCase()) },
  { name: 'age', validate: (value) => !isNaN(value) && value > 0 && value <= 120 },
  { name: 'gender', validate: (value) => ['male', 'female', 'other'].includes(value.toLowerCase()) },
  { name: 'symptoms', validate: (value) => Array.isArray(value) && value.length >= 2 },
  { name: 'duration', validate: (value) => !isNaN(value) && value > 0 },
  { name: 'durationUnit', validate: (value) => ['days', 'weeks', 'months'].includes(value.toLowerCase()) },
  { name: 'severity', validate: (value) => ['mild', 'moderate', 'severe'].includes(value.toLowerCase()) },
  { name: 'travelRegion', validate: (value, travelRiskFactors) => ['none', ...Object.keys(travelRiskFactors || {})].map(v => v.toLowerCase()).includes(value.toLowerCase()) },
  { name: 'riskFactors', validate: (value, riskFactorWeights) => Array.isArray(value) && (value.length === 0 || value.every((v) => Object.keys(riskFactorWeights || {}).includes(v))) },
  { name: 'drugHistory', validate: (value, drugHistoryWeights) => ['none', ...Object.keys(drugHistoryWeights || {})].map(v => v.toLowerCase()).includes(value.toLowerCase()) },
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
    age: ['i am', 'years old', 'age is', 'i'm'],
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
    requestsForDiagnosis: ['what\'s wrong', 'diagnose', 'what is it', 'what\'s the problem'],
    requestsForEmergencyHelp: ['emergency', 'urgent', 'help now', 'serious'],
    confusionOrClarification: ['what', 'huh', 'explain', 'clarify', 'don\'t understand'],
    feedbackOrComplaints: ['this is', 'not working', 'issue', 'problem', 'sucks'],
  },

  handleContext(input, currentStep, setMessages, addBotMessage, setInput, setCurrentStep, patientInfo) {
    const inputLower = input.toLowerCase().trim();
    const currentStepConfig = steps.find((step) => step.name === currentStep);
    const stepIndex = steps.findIndex((s) => s.name === currentStep);

    // Skip context handling if input is valid for the current step
    let value = inputLower;
    if (currentStep === 'age' || currentStep === 'duration') {
      const numberMatch = input.match(/\d+/);
      value = numberMatch ? parseInt(numberMatch[0], 10) : null;
    } else if (currentStep === 'gender') {
      value = ['male', 'female', 'other'].find((v) => inputLower.includes(v)) || null;
    } else if (currentStep === 'durationUnit') {
      value = ['days', 'weeks', 'months'].find((v) => inputLower.includes(v)) || null;
    } else if (currentStep === 'severity') {
      value = ['mild', 'moderate', 'severe'].find((v) => inputLower.includes(v)) || null;
    } else if (currentStep === 'travelRegion') {
      value = ['none', ...Object.keys(patientInfo.travelRiskFactors || {})]
        .find((v) => inputLower.includes(v.toLowerCase())) || null;
    } else if (currentStep === 'riskFactors') {
      if (inputLower === 'none' || inputLower === 'skip') {
        value = [];
      } else {
        const riskMatch = Object.keys(patientInfo.riskFactorWeights || {})
          .find((risk) => inputLower.includes(risk.toLowerCase()));
        if (riskMatch) {
          const currentRiskFactors = patientInfo.riskFactors || [];
          value = currentRiskFactors.includes(riskMatch) ? currentRiskFactors : [...currentRiskFactors, riskMatch];
        } else {
          value = null;
        }
      }
    } else if (currentStep === 'drugHistory') {
      value = ['none', ...Object.keys(patientInfo.drugHistoryWeights || {})]
        .find((v) => inputLower.includes(v.toLowerCase())) || null;
    } else if (currentStep === 'symptoms' && inputLower === 'done') {
      value = patientInfo.symptoms || [];
    } else if (currentStep === 'welcome') {
      value = ['start', 'help'].find((v) => inputLower.includes(v)) || null;
    } else if (currentStep === 'submit') {
      value = ['submit', 'done', 'finish'].find((v) => inputLower.includes(v)) || null;
    }

    if (value !== null && currentStepConfig?.validate(value, patientInfo.travelRiskFactors, patientInfo.riskFactorWeights, patientInfo.drugHistoryWeights)) {
      return false; // Valid input, let SymptomInput handle it
    }

    // Handle out-of-context input
    for (const [context, keywords] of Object.entries(ContextHandler.contexts)) {
      if (keywords.some((keyword) => inputLower.includes(keyword))) {
        let response;
        const stepPrompt = BotMessages.getStepPrompt(currentStep);
        
        switch (context) {
          case 'greetings':
            response = ContextHandler.getGreetingResponse(currentStep, stepPrompt);
            break;
          case 'farewells':
            response = ContextHandler.getFarewellResponse(currentStep, stepPrompt);
            break;
          case 'gratitude':
            response = ContextHandler.getGratitudeResponse(currentStep, stepPrompt);
            break;
          case 'apologies':
            response = ContextHandler.getApologyResponse(currentStep, stepPrompt);
            break;
          case 'symptomDescription':
            response = ContextHandler.getSymptomDescriptionResponse(currentStep, stepPrompt);
            break;
          case 'durationOfSymptoms':
            response = ContextHandler.getDurationResponse(currentStep, stepPrompt);
            break;
          case 'severityOfSymptoms':
            response = ContextHandler.getSeverityResponse(currentStep, stepPrompt);
            break;
          case 'locationOfSymptoms':
            response = ContextHandler.getLocationResponse(currentStep, stepPrompt);
            break;
          case 'onset':
            response = ContextHandler.getOnsetResponse(currentStep, stepPrompt);
            break;
          case 'triggersOrCauses':
            response = ContextHandler.getTriggersResponse(currentStep, stepPrompt);
            break;
          case 'relievingOrWorseningFactors':
            response = ContextHandler.getRelievingWorseningResponse(currentStep, stepPrompt);
            break;
          case 'associatedSymptoms':
            response = ContextHandler.getAssociatedSymptomsResponse(currentStep, stepPrompt);
            break;
          case 'medicalHistory':
          case 'medicationUse':
            response = ContextHandler.getMedicationUseResponse(currentStep, stepPrompt);
            break;
          case 'allergies':
            response = ContextHandler.getAllergiesResponse(currentStep, stepPrompt);
            break;
          case 'age':
            response = ContextHandler.getAgeResponse(currentStep, stepPrompt);
            break;
          case 'gender':
            response = ContextHandler.getGenderResponse(currentStep, stepPrompt);
            break;
          case 'pregnancyStatus':
            response = ContextHandler.getPregnancyResponse(currentStep, stepPrompt);
            break;
          case 'lifestyleFactors':
          case 'recentExposure':
            response = ContextHandler.getLifestyleResponse(currentStep, stepPrompt);
            break;
          case 'chronicConditions':
            response = ContextHandler.getChronicConditionsResponse(currentStep, stepPrompt);
            break;
          case 'familyMedicalHistory':
            response = ContextHandler.getFamilyHistoryResponse(currentStep, stepPrompt);
            break;
          case 'recentTravel':
            response = ContextHandler.getRecentTravelResponse(currentStep, stepPrompt);
            break;
          case 'vaccinationStatus':
            response = ContextHandler.getVaccinationStatusResponse(currentStep, stepPrompt);
            break;
          case 'mentalHealthSymptoms':
            response = ContextHandler.getMentalHealthResponse(currentStep, stepPrompt);
            break;
          case 'requestsForAdvice':
            response = ContextHandler.getAdviceResponse(currentStep, stepPrompt);
            break;
          case 'requestsForDiagnosis':
            response = ContextHandler.getDiagnosisResponse(currentStep, stepPrompt);
            break;
          case 'requestsForEmergencyHelp':
            response = ContextHandler.getEmergencyResponse(currentStep, stepPrompt);
            break;
          case 'confusionOrClarification':
            response = ContextHandler.getClarificationResponse(currentStep, stepPrompt);
            break;
          case 'feedbackOrComplaints':
            response = ContextHandler.getFeedbackResponse(currentStep, stepPrompt);
            break;
          default:
            response = ContextHandler.getErrorResponse(currentStep, stepPrompt);
        }
        addBotMessage(response);
        setInput('');
        return true;
      }
    }

    addBotMessage(ContextHandler.getErrorResponse(currentStep, BotMessages.getStepPrompt(currentStep)));
    setInput('');
    return true;
  },

  // Context-specific response methods
  getGreetingResponse(currentStep, stepPrompt) {
    const responses = currentStep === 'welcome' 
      ? ['Hi! Nice to see you! Type "start" to begin or "help" for more info.',
         'Hello! Great to hear from you. Type "start" to proceed or "help" for guidance.']
      : [`Hey there! Let's keep going. ${stepPrompt}`,
         `Hi! Thanks for the greeting. ${stepPrompt}`];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getFarewellResponse(currentStep, stepPrompt) {
    const responses = [
      `Goodbye! If you want to continue, ${stepPrompt}`,
      `See you later! Let's get back to it: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getGratitudeResponse(currentStep, stepPrompt) {
    const responses = [
      `You're welcome! Now, ${stepPrompt}`,
      `Thanks for the thanks! Let's continue: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getApologyResponse(currentStep, stepPrompt) {
    const responses = [
      `No worries at all! Let's move on: ${stepPrompt}`,
      `All good! Please continue with ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getSymptomDescriptionResponse(currentStep, stepPrompt) {
    const responses = [
      `I hear you're not feeling well. Let's focus on: ${stepPrompt}`,
      `Sorry you're feeling sick. Please provide: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getDurationResponse(currentStep, stepPrompt) {
    const responses = [
      `Thanks for the info. For now, please provide: ${stepPrompt}`,
      `Got it. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getSeverityResponse(currentStep, stepPrompt) {
    const responses = [
      `That sounds tough. Please focus on: ${stepPrompt}`,
      `I understand. Let's proceed with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getLocationResponse(currentStep, stepPrompt) {
    const responses = [
      `Noted. Please provide the current info needed: ${stepPrompt}`,
      `Thanks for sharing. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getOnsetResponse(currentStep, stepPrompt) {
    const responses = [
      `Good to know. Please provide: ${stepPrompt}`,
      `Thanks for the detail. Now, ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getTriggersResponse(currentStep, stepPrompt) {
    const responses = [
      `That's helpful. Let's focus on: ${stepPrompt}`,
      `Noted. Please continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getRelievingWorseningResponse(currentStep, stepPrompt) {
    const responses = [
      `Thanks for sharing. Please provide: ${stepPrompt}`,
      `Got it. Let's move on to: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getAssociatedSymptomsResponse(currentStep, stepPrompt) {
    const responses = [
      `Additional symptoms noted. Please focus on: ${stepPrompt}`,
      `Thanks for the info. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getMedicationUseResponse(currentStep, stepPrompt) {
    const responses = [
      `Good to know. Please focus on: ${stepPrompt}`,
      `Thanks for sharing. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getAllergiesResponse(currentStep, stepPrompt) {
    const responses = [
      `Noted. Please provide the current info needed: ${stepPrompt}`,
      `Thanks for the info. Let's move on to: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getAgeResponse(currentStep, stepPrompt) {
    const responses = [
      `Thanks for sharing. Please provide: ${stepPrompt}`,
      `Got it. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getGenderResponse(currentStep, stepPrompt) {
    const responses = [
      `Noted. Please select your gender: ${stepPrompt}`,
      `Thanks for the info. Let's focus on: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getPregnancyResponse(currentStep, stepPrompt) {
    const responses = [
      `That's important to know. Please provide: ${stepPrompt}`,
      `Thanks for sharing. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getLifestyleResponse(currentStep, stepPrompt) {
    const responses = [
      `Good to know. Please focus on: ${stepPrompt}`,
      `Thanks for the detail. Let's proceed with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getChronicConditionsResponse(currentStep, stepPrompt) {
    const responses = [
      `Noted. Please provide: ${stepPrompt}`,
      `Thanks for sharing. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getFamilyHistoryResponse(currentStep, stepPrompt) {
    const responses = [
      `Thanks for the info. Please focus on: ${stepPrompt}`,
      `Noted. Let's move on to: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getRecentTravelResponse(currentStep, stepPrompt) {
    const responses = [
      `Good to know. Please provide: ${stepPrompt}`,
      `Thanks for sharing. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getVaccinationStatusResponse(currentStep, stepPrompt) {
    const responses = [
      `Thanks for sharing. Please provide: ${stepPrompt}`,
      `Noted. Let's continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getMentalHealthResponse(currentStep, stepPrompt) {
    const responses = [
      `I'm here to help. Please focus on: ${stepPrompt}`,
      `Thanks for sharing. Let's proceed with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getAdviceResponse(currentStep, stepPrompt) {
    const responses = [
      `I'll provide guidance as we go. Please continue with: ${stepPrompt}`,
      `Let's get the details first. Please provide: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getDiagnosisResponse(currentStep, stepPrompt) {
    const responses = [
      `We'll analyze everything soon. For now, please provide: ${stepPrompt}`,
      `I'll help with that at the end. Please focus on: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getEmergencyResponse(currentStep, stepPrompt) {
    const responses = [
      `If it's urgent, please call emergency services. Otherwise, let's continue: ${stepPrompt}`,
      `Please seek immediate help if it's serious. For now, ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getClarificationResponse(currentStep, stepPrompt) {
    const responses = [
      `Let me clarify: ${stepPrompt}`,
      `No problem, here's what I need: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getFeedbackResponse(currentStep, stepPrompt) {
    const responses = [
      `Thanks for the feedback. Let's keep going with: ${stepPrompt}`,
      `I appreciate your input. Please continue with: ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getErrorResponse(currentStep, stepPrompt) {
    const responses = [
      `I didn't understand that. Please try again: ${stepPrompt}`,
      `Could you please rephrase that? ${stepPrompt}`,
      `I'm not sure what you mean. ${stepPrompt}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },
};

export default ContextHandler;