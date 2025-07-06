// src/components/SymptomInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import PatientInfoSelector from './PatientInfoSelector';
import BotMessages from './BotMessages';
import ContextHandler from './ContextHandler';
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
  const [messages, setMessages] = useState([{ role: 'bot', content: BotMessages.getWelcomeMessage() }]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { role: 'bot', content: text, isTyping: true }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].isTyping = false;
        return updated;
      });
      setIsTyping(false);
    }, text.length * 30 + 500);
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    if (field === 'symptoms') {
      setSelectedSymptoms(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
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
      {['gender', 'durationUnit', 'severity', 'travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) && (
        <PatientInfoSelector
          currentStep={currentStep}
          patientInfo={patientInfo}
          handlePatientInfoChange={handlePatientInfoChange}
          travelRiskFactors={parentTravelRiskFactors || travelRiskFactors}
          riskFactorWeights={parentRiskFactorWeights || riskFactorWeights}
          drugHistoryWeights={parentDrugHistoryWeights || drugHistoryWeights}
        />
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
                ? 'Type symptoms or type "done"'
                : currentStep === 'riskFactors' || currentStep === 'travelRegion' || currentStep === 'drugHistory'
                ? `Type option or "none"`
                : `Enter ${currentStep}`
            }
            className="flex-1 p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
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