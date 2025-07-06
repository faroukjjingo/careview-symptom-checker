// src/components/SymptomInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Send, Bot } from 'lucide-react';
import SymptomChat from './SymptomChat';
import SymptomSelector from './SymptomSelector';
import PatientInfoSelector from './PatientInfoSelector';
import { symptomList } from '../utils/SymptomList';
import { symptomCombinations } from '../utils/SymptomCombinations';
import { travelRiskFactors } from '../utils/TravelRiskFactors';
import { riskFactorWeights } from '../utils/RiskFactorWeights';
import drugHistoryWeights from '../utils/DrugHistoryWeights';
import calculateDiagnosis from '../utils/SymptomCalculations';

const SymptomInput = ({ selectedSymptoms, setSelectedSymptoms, patientInfo, setPatientInfo, onDiagnosisResults }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm CareView, your symptom checker developed by trusted healthcare professionals. Type 'start' to begin or 'help' for more info.",
      isUser: false,
      isTyping: false,
    },
  ]);
  const [typingMessage, setTypingMessage] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const steps = {
    welcome: { next: 'age', validate: () => true, error: '' },
    age: {
      next: 'gender',
      validate: (value) => value && !isNaN(parseInt(value)) && parseInt(value) > 0 && parseInt(value) <= 120,
      error: 'Please enter a valid age (1-120).',
    },
    gender: { next: 'symptoms', validate: (value) => ['Male', 'Female', 'Other'].includes(value), error: 'Please select a valid gender.' },
    symptoms: { next: 'duration', validate: () => selectedSymptoms.length >= 2, error: 'Please select at least two symptoms.' },
    duration: {
      next: 'durationUnit',
      validate: (value) => value && !isNaN(parseInt(value)) && parseInt(value) > 0 && parseInt(value) <= 1000,
      error: 'Please enter a valid duration (1-1000).',
    },
    durationUnit: {
      next: 'severity',
      validate: (value) => ['Days', 'Weeks', 'Months'].includes(value),
      error: 'Please select Days, Weeks, or Months.',
    },
    severity: {
      next: 'travelRegion',
      validate: (value) => ['Mild', 'Moderate', 'Severe'].includes(value),
      error: 'Please select a severity level.',
    },
    travelRegion: {
      next: 'riskFactors',
      validate: (value) => [...Object.keys(travelRiskFactors), 'None'].includes(value),
      error: 'Please select a travel region or "None".',
    },
    riskFactors: { next: 'drugHistory', validate: () => true, error: '' },
    drugHistory: {
      next: 'submit',
      validate: (value) => Object.keys(drugHistoryWeights).includes(value),
      error: 'Please select a drug history option.',
    },
    submit: { next: null, validate: () => true, error: '' },
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (currentStep !== 'welcome') {
      inputRef.current?.focus();
    }
  }, [messages, currentStep]);

  useEffect(() => {
    if (currentStep === 'submit') {
      handleSubmit();
    }
  }, [currentStep]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.isTyping && typingMessage) {
      if (typingIndex < typingMessage.length) {
        const timer = setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = typingMessage.slice(0, typingIndex + 1);
            return updated;
          });
          setTypingIndex((prev) => prev + 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].isTyping = false;
          return updated;
        });
        setTypingMessage('');
        setTypingIndex(0);
      }
    }
  }, [typingIndex, typingMessage, messages]);

  const addBotMessage = (text) => {
    setTypingMessage(text);
    setTypingIndex(0);
    setMessages((prev) => [...prev, { text: '', isUser: false, isTyping: true }]);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInput(text);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    if (currentStep === 'symptoms') {
      const availableSymptoms = Array.isArray(symptomList) ? symptomList : Object.keys(symptomList);
      const filteredSymptoms = availableSymptoms
        .filter(
          (symptom) =>
            symptom.toLowerCase().includes(text.toLowerCase()) &&
            !selectedSymptoms.includes(symptom)
        )
        .slice(0, 3);

      const combinationKeys = Object.keys(symptomCombinations);
      const filteredCombinations = combinationKeys
        .filter((combination) => {
          const symptoms = combination.split(', ');
          return (
            symptoms.some((symptom) => symptom.toLowerCase().includes(text.toLowerCase())) &&
            symptoms.some((symptom) => !selectedSymptoms.includes(symptom))
          );
        })
        .slice(0, 2);

      const combinedSuggestions = [
        ...filteredCombinations.map((combination) => ({
          type: 'combination',
          text: combination,
          symptoms: combination.split(', '),
        })),
        ...filteredSymptoms.map((symptom) => ({
          type: 'single',
          text: symptom,
        })),
      ];

      setSuggestions(combinedSuggestions);
    } else if (['gender', 'durationUnit', 'severity', 'travelRegion', 'drugHistory'].includes(currentStep)) {
      const options = {
        gender: ['Male', 'Female', 'Other'],
        durationUnit: ['Days', 'Weeks', 'Months'],
        severity: ['Mild', 'Moderate', 'Severe'],
        travelRegion: [...Object.keys(travelRiskFactors), 'None'],
        drugHistory: Object.keys(drugHistoryWeights),
      }[currentStep];
      const filteredOptions = options
        .filter((option) => option.toLowerCase().includes(text.toLowerCase()))
        .slice(0, 4);
      setSuggestions(filteredOptions.map((option) => ({ type: 'single', text: option })));
    } else {
      setSuggestions([]);
    }
  };

  const handleSymptomSelect = (suggestion) => {
    let symptomsToAdd = suggestion.type === 'combination' ? suggestion.symptoms : [suggestion.text];
    const uniqueNewSymptoms = symptomsToAdd.filter((symptom) => !selectedSymptoms.includes(symptom));

    if (uniqueNewSymptoms.length > 0) {
      const updatedSymptoms = [...selectedSymptoms, ...uniqueNewSymptoms];
      setSelectedSymptoms(updatedSymptoms);
      setMessages((prev) => [
        ...prev,
        { text: `Added: ${uniqueNewSymptoms.join(', ')}`, isUser: true },
      ]);
      addBotMessage(`Got it! Any more symptoms? (You need at least two. Type "done" when ready.)`);
      setError('');
    }

    setInput('');
    setSuggestions([]);
  };

  const removeSymptom = (symptomToRemove) => {
    const updatedSymptoms = selectedSymptoms.filter((s) => s !== symptomToRemove);
    setSelectedSymptoms(updatedSymptoms);
    setMessages((prev) => [
      ...prev,
      { text: `Removed: ${symptomToRemove}`, isUser: true },
    ]);
    addBotMessage(`Any more symptoms to add or remove? (Type "done" when ready.)`);
  };

  const handlePatientInfoChange = (field, value) => {
    if (!steps[field].validate(value)) {
      setError(steps[field].error);
      addBotMessage(steps[field].error);
      return;
    }
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    setMessages((prev) => [
      ...prev,
      { text: `${field.charAt(0).toUpperCase() + field.slice(1)}: ${Array.isArray(value) ? value.join(', ') || 'None' : value}`, isUser: true },
    ]);
    setCurrentStep(steps[field].next);
    addBotMessage(getNextPrompt(steps[field].next));
    setInput('');
    setSuggestions([]);
    setError('');
  };

  const getNextPrompt = (step) => {
    switch (step) {
      case 'age':
        return "Let's start with your age. How old are you? (Enter a number between 1 and 120)";
      case 'gender':
        return "What is your gender? Please select or type: Male, Female, or Other.";
      case 'symptoms':
        return "Now, tell me about your symptoms. Type to search and select at least two. When you're done, type 'done'.";
      case 'duration':
        return "How long have you been experiencing these symptoms? (Enter a number, e.g., 3)";
      case 'durationUnit':
        return "Is that in Days, Weeks, or Months? Please select or type one.";
      case 'severity':
        return "How severe are your symptoms? Please select or type: Mild, Moderate, or Severe.";
      case 'travelRegion':
        return "Have you traveled recently? Select a region or 'None' if you haven't.";
      case 'riskFactors':
        return "Any risk factors to note? Select any that apply or type 'none' to skip.";
      case 'drugHistory':
        return "What about your medication history? Please select or type an option.";
      case 'submit':
        return "All set! I'm analyzing your information now...";
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
    const result = await calculateDiagnosis(
      selectedSymptoms,
      parseInt(patientInfo.duration),
      patientInfo.durationUnit,
      patientInfo.severity,
      parseInt(patientInfo.age),
      patientInfo.gender,
      patientInfo.drugHistory,
      patientInfo.travelRegion,
      patientInfo.riskFactors
    );
    onDiagnosisResults(result);
  };

  const handleInputSubmit = (e) => {
    if (e.key !== 'Enter' && e.type !== 'click') return;
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: input, isUser: true },
    ]);

    const inputLower = input.toLowerCase().trim();

    if (currentStep === 'welcome') {
      if (inputLower === 'start') {
        setCurrentStep('age');
        addBotMessage(getNextPrompt('age'));
      } else if (inputLower === 'help') {
        addBotMessage(
          "I'm CareView, developed by trusted healthcare professionals to help you understand your symptoms. I'll guide you step-by-step to enter your details. Type 'start' to begin, use the dropdowns to select options, or type your answers. You can type 'done' for symptoms or 'none' for optional fields like risk factors or travel."
        );
      } else {
        addBotMessage("Hmm, please type 'start' to begin or 'help' for more info.");
      }
      setInput('');
    } else if (currentStep === 'symptoms') {
      if (inputLower === 'done') {
        if (selectedSymptoms.length < 2) {
          setError('Please select at least two symptoms.');
          addBotMessage('You need at least two symptoms to proceed. Please add more or select from the list.');
        } else {
          setCurrentStep(steps[currentStep].next);
          addBotMessage(getNextPrompt(steps[currentStep].next));
          setInput('');
        }
      } else if (suggestions.length > 0) {
        handleSymptomSelect(suggestions[0]);
      } else {
        setError('Please select a valid symptom from the list.');
        addBotMessage('That symptom isn\'t in our list. Please select one from the suggestions.');
        setInput('');
      }
    } else if (currentStep === 'riskFactors' && inputLower === 'none') {
      handlePatientInfoChange('riskFactors', []);
    } else if (currentStep === 'travelRegion' && inputLower === 'none') {
      handlePatientInfoChange('travelRegion', 'None');
    } else if (['age', 'duration'].includes(currentStep)) {
      if (steps[currentStep].validate(input)) {
        handlePatientInfoChange(currentStep, input);
      } else {
        setError(steps[currentStep].error);
        addBotMessage(steps[currentStep].error);
        setInput('');
      }
    } else if (['gender', 'durationUnit', 'severity', 'travelRegion', 'drugHistory'].includes(currentStep)) {
      const options = {
        gender: ['Male', 'Female', 'Other'],
        durationUnit: ['Days', 'Weeks', 'Months'],
        severity: ['Mild', 'Moderate', 'Severe'],
        travelRegion: [...Object.keys(travelRiskFactors), 'None'],
        drugHistory: Object.keys(drugHistoryWeights),
      }[currentStep];
      const matchedOption = options.find((opt) => opt.toLowerCase() === inputLower);
      if (matchedOption && steps[currentStep].validate(matchedOption)) {
        handlePatientInfoChange(currentStep, matchedOption);
      } else {
        setError(`Please select a valid ${currentStep} from the suggestions or type a matching value.`);
        addBotMessage(`That's not a valid ${currentStep}. Please select from the suggestions or type a matching value.`);
        setInput('');
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4 max-h-[70dvh] flex flex-col">
      <SymptomChat
        messages={messages}
        chatEndRef={chatEndRef}
        error={error}
      />
      {currentStep === 'symptoms' && (
        <SymptomSelector
          selectedSymptoms={selectedSymptoms}
          removeSymptom={removeSymptom}
          suggestions={suggestions}
          handleSymptomSelect={handleSymptomSelect}
        />
      )}
      {['gender', 'durationUnit', 'severity', 'travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) && (
        <PatientInfoSelector
          currentStep={currentStep}
          patientInfo={patientInfo}
          handlePatientInfoChange={handlePatientInfoChange}
          travelRiskFactors={travelRiskFactors}
          riskFactorWeights={riskFactorWeights}
          drugHistoryWeights={drugHistoryWeights}
        />
      )}
      {currentStep !== 'submit' && (
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleInputSubmit}
              onFocus={() => window.scrollTo({ top: inputRef.current.offsetTop - 100, behavior: 'smooth' })}
              placeholder={
                currentStep === 'symptoms'
                  ? 'Type symptoms or "done"'
                  : currentStep === 'riskFactors'
                  ? 'Type "none" or select from list'
                  : currentStep === 'travelRegion'
                  ? 'Type region or "none"'
                  : currentStep === 'welcome'
                  ? 'Type "start" or "help"'
                  : `Enter ${currentStep}`
              }
              className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base touch-manipulation"
              disabled={currentStep === 'submit'}
            />
            {currentStep === 'symptoms' && (
              <Plus
                size={16}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
              />
            )}
          </div>
          <button
            onClick={handleInputSubmit}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
            disabled={currentStep === 'submit' || !input.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SymptomInput;