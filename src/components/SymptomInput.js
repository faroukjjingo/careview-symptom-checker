// src/components/SymptomInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import PatientInfoSelector from './PatientInfoSelector';
import BotMessages from './BotMessages';
import ContextHandler from './ContextHandler';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import { travelRiskFactors } from './TravelRiskFactors';
import { riskFactorWeights } from './RiskFactorWeights';
import drugHistoryWeights from './DrugHistoryWeights';
import calculateDiagnosis from './SymptomCalculations';

const SymptomInput = ({
  selectedSymptoms,
  setSelectedSymptoms,
  patientInfo,
  setPatientInfo,
  onDiagnosisResults,
  travelRiskFactors: parentTravelRiskFactors,
  riskFactorWeights: parentRiskFactorWeights,
  drugHistoryWeights: parentDrugHistoryWeights,
}) => {
  const [messages, setMessages] = useState([{ role: 'bot', content: BotMessages.getWelcomeMessage(), isTyping: false }]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const chatEndRef = useRef(null);
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
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (!value) return;

    if (currentStep === 'symptoms' || currentStep === 'riskFactors') {
      const itemsToAdd = value.includes(', ') ? value.split(', ') : [value];
      const uniqueNewItems = itemsToAdd.filter((item) => !(patientInfo[field] || []).includes(item));
      if (uniqueNewItems.length > 0) {
        const updatedItems = [...(patientInfo[field] || []), ...uniqueNewItems];
        handlePatientInfoChange(field, updatedItems);
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: `Added: ${uniqueNewItems.join(', ')}`, isTyping: false },
        ]);
        addBotMessage(BotMessages.getStepPrompt(field));
      }
    } else {
      handlePatientInfoChange(currentStep, value);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `${currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}: ${value}`, isTyping: false },
      ]);
      const stepIndex = ContextHandler.steps.findIndex((s) => s.name === currentStep);
      const nextStep = ContextHandler.steps[stepIndex + 1]?.name;
      if (nextStep) {
        setCurrentStep(nextStep);
        addBotMessage(BotMessages.getStepPrompt(nextStep));
      }
    }
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input, isTyping: false }]);
    ContextHandler.handleContext(
      input,
      currentStep,
      setMessages,
      addBotMessage,
      handlePatientInfoChange,
      setInput,
      setCurrentStep,
      {
        ...patientInfo,
        travelRiskFactors: parentTravelRiskFactors || travelRiskFactors,
        riskFactorWeights: parentRiskFactorWeights || riskFactorWeights,
        drugHistoryWeights: parentDrugHistoryWeights || drugHistoryWeights,
      }
    );
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages]);

  const getOptions = () => {
    let options = [];
    if (currentStep === 'symptoms') {
      const availableSymptoms = Array.isArray(symptomList) ? symptomList : Object.keys(symptomList);
      const filteredSymptoms = availableSymptoms
        .filter(
          (symptom) =>
            symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedSymptoms.includes(symptom)
        )
        .sort((a, b) => a.localeCompare(b));
      const filteredCombinations = Object.keys(symptomCombinations)
        .filter((combination) =>
          combination.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b));
      options = [...filteredSymptoms, ...filteredCombinations];
    } else if (currentStep === 'riskFactors') {
      options = Object.keys(parentRiskFactorWeights || riskFactorWeights)
        .filter((risk) => risk.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
    } else if (currentStep === 'drugHistory') {
      options = ['None', ...Object.keys(parentDrugHistoryWeights || drugHistoryWeights)]
        .filter((drug) => drug.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
    } else if (currentStep === 'travelRegion') {
      options = ['None', ...Object.keys(parentTravelRiskFactors || travelRiskFactors)]
        .filter((region) => region.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
    } else if (currentStep === 'gender') {
      options = ['Male', 'Female', 'Other'];
    } else if (currentStep === 'durationUnit') {
      options = ['Days', 'Weeks', 'Months'];
    } else if (currentStep === 'severity') {
      options = ['Mild', 'Moderate', 'Severe'];
    }
    return options;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4 max-h-[70dvh] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span
              className={`inline-block p-2 rounded-lg max-w-[80%] ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              } ${msg.isTyping ? 'italic opacity-70' : ''}`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {['age', 'gender', 'symptoms', 'duration', 'durationUnit', 'severity', 'travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) && (
        <div className="space-y-2">
          {['symptoms', 'riskFactors', 'drugHistory', 'travelRegion'].includes(currentStep) && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${currentStep}`}
              className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
            />
          )}
          <select
            onChange={handleSelectChange}
            value=""
            multiple={currentStep === 'symptoms' || currentStep === 'riskFactors'}
            className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
          >
            <option value="" disabled>
              Select {currentStep}
            </option>
            {getOptions().map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {(currentStep === 'symptoms' || currentStep === 'riskFactors') && (
            <div className="flex flex-wrap gap-2">
              {(patientInfo[currentStep] || []).map((item, index) => (
                <span
                  key={index}
                  className="p-2 bg-secondary text-secondary-foreground rounded-lg text-sm"
                >
                  {item}
                  <button
                    onClick={() => {
                      const updatedItems = patientInfo[currentStep].filter((s) => s !== item);
                      handlePatientInfoChange(currentStep, updatedItems);
                      setMessages((prev) => [
                        ...prev,
                        { role: 'user', content: `Removed: ${item}`, isTyping: false },
                      ]);
                      addBotMessage(BotMessages.getStepPrompt(currentStep));
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {['symptoms', 'travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) && (
            <button
              onClick={() => {
                if (currentStep === 'symptoms' || currentStep === 'riskFactors') {
                  handlePatientInfoChange(currentStep, []);
                } else {
                  handlePatientInfoChange(currentStep, 'None');
                }
              }}
              className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all text-sm"
            >
              Skip
            </button>
          )}
        </div>
      )}
      {currentStep !== 'submit' && (
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentStep === 'welcome'
                ? 'Type "start" or "help"'
                : currentStep === 'symptoms'
                ? 'Type "done" when finished'
                : currentStep === 'riskFactors' || currentStep === 'travelRegion' || currentStep === 'drugHistory'
                ? 'Type "none" or select above'
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