// src/components/SymptomInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import PatientInfoSelector from './PatientInfoSelector';
import BotMessages from './BotMessages';
import ContextHandler from './ContextHandler';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import calculateDiagnosis from './SymptomCalculations';

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

const SymptomInput = ({
  selectedSymptoms,
  setSelectedSymptoms,
  patientInfo,
  setPatientInfo,
  onDiagnosisResults,
  messages,
  setMessages,
  travelRiskFactors,
  riskFactorWeights,
  drugHistoryWeights,
}) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const inputRef = useRef(null);

  const addBotMessage = (text) => {
    setTypingText(text);
    setTypingIndex(0);
    setMessages((prev) => [...prev, { role: 'bot', content: '', isTyping: true }]);
    setIsTyping(true);
  };

  useEffect(() => {
    if (isTyping && typingText && typingIndex < typingText.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = typingText.slice(0, typingIndex + 1);
          return updated;
        });
        setTypingIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else if (isTyping && typingIndex >= typingText.length) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].isTyping = false;
        return updated;
      });
      setIsTyping(false);
      setTypingText('');
      setTypingIndex(0);
    }
  }, [isTyping, typingIndex, typingText]);

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    if (field === 'symptoms') {
      setSelectedSymptoms(value);
    }
    if (field !== 'symptoms' && field !== 'riskFactors') {
      const stepIndex = steps.findIndex((s) => s.name === field);
      const nextStep = steps[stepIndex + 1]?.name;
      if (nextStep) {
        setCurrentStep(nextStep);
        addBotMessage(BotMessages.getStepPrompt(nextStep));
      }
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInput(text);

    if (currentStep !== 'symptoms' || !text.trim()) {
      setSuggestions([]);
      return;
    }

    const availableSymptoms = Array.isArray(symptomList) ? symptomList : Object.keys(symptomList);
    const filteredSymptoms = availableSymptoms
      .filter(
        (symptom) =>
          symptom.toLowerCase().includes(text.toLowerCase()) &&
          !selectedSymptoms.includes(symptom)
      )
      .slice(0, 5);

    const filteredCombinations = Object.keys(symptomCombinations)
      .filter((combination) =>
        combination.toLowerCase().includes(text.toLowerCase())
      )
      .slice(0, 5);

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
  };

  const handleSymptomSelect = (suggestion) => {
    const symptomsToAdd = suggestion.type === 'combination' ? suggestion.symptoms : [suggestion.text];
    const uniqueNewSymptoms = symptomsToAdd.filter((symptom) => !selectedSymptoms.includes(symptom));
    if (uniqueNewSymptoms.length > 0) {
      const updatedSymptoms = [...selectedSymptoms, ...uniqueNewSymptoms];
      handlePatientInfoChange('symptoms', updatedSymptoms);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Added: ${uniqueNewSymptoms.join(', ')}`, isTyping: false },
      ]);
      addBotMessage(BotMessages.getSymptomPrompt());
    }
    setInput('');
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input, isTyping: false }]);

    const currentStepConfig = steps.find((step) => step.name === currentStep);
    const stepIndex = steps.findIndex((s) => s.name === currentStep);
    const nextStep = steps[stepIndex + 1]?.name;

    if (currentStep === 'welcome') {
      if (input.toLowerCase() === 'start') {
        setCurrentStep('age');
        addBotMessage(BotMessages.getStepPrompt('age'));
        setInput('');
        return;
      } else if (input.toLowerCase() === 'help') {
        addBotMessage(BotMessages.getHelpMessage());
        setInput('');
        return;
      }
    } else if (currentStep === 'symptoms' && input.toLowerCase() === 'done') {
      if ((patientInfo.symptoms || []).length >= 2) {
        setCurrentStep(nextStep || 'duration');
        addBotMessage(BotMessages.getStepPrompt(nextStep || 'duration'));
        setInput('');
        return;
      } else {
        addBotMessage('Please provide at least two symptoms before typing "done".');
        setInput('');
        return;
      }
    } else if (currentStep === 'symptoms' && suggestions.length > 0) {
      const matchedSuggestion = suggestions.find(
        (s) => s.text.toLowerCase() === input.toLowerCase()
      );
      if (matchedSuggestion) {
        handleSymptomSelect(matchedSuggestion);
        return;
      }
    } else if (currentStepConfig && currentStepConfig.validate) {
      let value = input.toLowerCase();
      if (currentStep === 'age' || currentStep === 'duration') {
        const numberMatch = input.match(/\d+/);
        value = numberMatch ? parseInt(numberMatch[0], 10) : null;
      } else if (currentStep === 'gender') {
        value = ['male', 'female', 'other']
          .find((v) => input.toLowerCase().includes(v)) || value;
        value = value.charAt(0).toUpperCase() + value.slice(1);
      } else if (currentStep === 'durationUnit') {
        value = ['days', 'weeks', 'months']
          .find((v) => input.toLowerCase().includes(v)) || value;
        value = value.charAt(0).toUpperCase() + value.slice(1);
      } else if (currentStep === 'severity') {
        value = ['mild', 'moderate', 'severe']
          .find((v) => input.toLowerCase().includes(v)) || value;
        value = value.charAt(0).toUpperCase() + value.slice(1);
      } else if (currentStep === 'travelRegion' && input.toLowerCase() === 'none') {
        value = 'None';
      } else if (currentStep === 'travelRegion') {
        value = Object.keys(travelRiskFactors)
          .find((v) => input.toLowerCase().includes(v.toLowerCase())) || value;
        value = value.charAt(0).toUpperCase() + value.slice(1);
      } else if (currentStep === 'riskFactors' && (input.toLowerCase() === 'skip' || input.toLowerCase() === 'none')) {
        value = [];
      } else if (currentStep === 'riskFactors') {
        const riskMatch = Object.keys(riskFactorWeights)
          .find((risk) => input.toLowerCase().includes(risk.toLowerCase()));
        if (riskMatch) {
          const currentRiskFactors = patientInfo.riskFactors || [];
          value = currentRiskFactors.includes(riskMatch) ? currentRiskFactors : [...currentRiskFactors, riskMatch];
        }
      } else if (currentStep === 'drugHistory' && (input.toLowerCase() === 'skip' || input.toLowerCase() === 'none')) {
        value = 'None';
      } else if (currentStep === 'drugHistory') {
        value = Object.keys(drugHistoryWeights)
          .find((drug) => input.toLowerCase().includes(drug.toLowerCase())) || value;
      } else if (currentStep === 'submit' && ['submit', 'done', 'finish'].includes(input.toLowerCase())) {
        value = true;
      }

      if (value !== null && currentStepConfig.validate(value, travelRiskFactors, riskFactorWeights, drugHistoryWeights)) {
        handlePatientInfoChange(currentStep, value);
        setInput('');
        if (currentStep === 'submit') {
          addBotMessage(BotMessages.getStepPrompt('submit'));
        } else if (currentStep === 'riskFactors') {
          addBotMessage(BotMessages.getStepPrompt(currentStep));
        }
        return;
      }
    }

    if (ContextHandler.handleContext(input, currentStep, setMessages, addBotMessage, setInput, patientInfo)) {
      return;
    }
  };

  useEffect(() => {
    if (currentStep === 'submit') {
      calculateDiagnosis(
        selectedSymptoms,
        parseInt(patientInfo.duration),
        patientInfo.durationUnit,
        patientInfo.severity,
        parseInt(patientInfo.age),
        patientInfo.gender,
        patientInfo.drugHistory,
        patientInfo.travelRegion,
        patientInfo.riskFactors
      ).then((result) => {
        onDiagnosisResults(result);
      });
    }
  }, [currentStep, selectedSymptoms, patientInfo, onDiagnosisResults]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
      {currentStep === 'symptoms' && suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSymptomSelect(suggestion)}
                className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all text-sm"
              >
                {suggestion.text}
              </button>
            ))}
            <button
              onClick={() => {
                if ((patientInfo.symptoms || []).length >= 2) {
                  setCurrentStep(steps[steps.findIndex((s) => s.name === 'symptoms') + 1].name);
                  addBotMessage(BotMessages.getStepPrompt(steps[steps.findIndex((s) => s.name === 'symptoms') + 1].name));
                } else {
                  addBotMessage('Please provide at least two symptoms before typing "done".');
                }
                setInput('');
                setSuggestions([]);
              }}
              className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all text-sm"
            >
              Done
            </button>
          </div>
        </div>
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
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              currentStep === 'welcome'
                ? 'Type "start" or "help"'
                : currentStep === 'symptoms'
                ? 'Type symptoms or "done"'
                : currentStep === 'riskFactors' || currentStep === 'travelRegion' || currentStep === 'drugHistory'
                ? 'Type option or "none"'
                : currentStep === 'age' || currentStep === 'duration'
                ? `Enter ${currentStep} (number)`
                : `Enter ${currentStep}`
            }
            className="flex-1 p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base touch-manipulation"
            disabled={currentStep === 'submit'}
          />
          <button
            type="submit"
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
            disabled={currentStep === 'submit' || !input.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
};

export default SymptomInput;