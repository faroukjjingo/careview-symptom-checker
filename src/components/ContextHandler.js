// src/components/ContextHandler.js
import BotMessages from './BotMessages';

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

  handleContext(input, currentStep, setMessages, addBotMessage, setInput) {
    const inputLower = input.toLowerCase().trim();
    
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
            response = BotMessages.getSymptomDescriptionResponse(currentStep);
            break;
          case 'durationOfSymptoms':
            response = BotMessages.getDurationResponse(currentStep);
            break;
          case 'severityOfSymptoms':
            response = BotMessages.getSeverityResponse(currentStep);
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
            response = BotMessages.getAssociatedSymptomsResponse(currentStep);
            break;
          case 'medicalHistory':
          case 'medicationUse':
            response = BotMessages.getMedicationUseResponse(currentStep);
            break;
          case 'allergies':
            response = BotMessages.getAllergiesResponse(currentStep);
            break;
          case 'age':
            response = BotMessages.getAgeResponse(currentStep);
            break;
          case 'gender':
            response = BotMessages.getGenderResponse(currentStep);
            break;
          case 'pregnancyStatus':
            response = BotMessages.getPregnancyResponse(currentStep);
            break;
          case 'lifestyleFactors':
          case 'recentExposure':
            response = BotMessages.getLifestyleResponse(currentStep);
            break;
          case 'chronicConditions':
            response = BotMessages.getChronicConditionsResponse(currentStep);
            break;
          case 'familyMedicalHistory':
            response = BotMessages.getFamilyHistoryResponse(currentStep);
            break;
          case 'recentTravel':
            response = BotMessages.getRecentTravelResponse(currentStep);
            break;
          case 'vaccinationStatus':
            response = BotMessages.getVaccinationStatusResponse(currentStep);
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

    addBotMessage(BotMessages.getErrorResponse(currentStep));
    setInput('');
    return true;
  },
};

export default ContextHandler;