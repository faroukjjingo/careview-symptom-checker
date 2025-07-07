import React, { createContext, useState, useEffect } from 'react';
import calculateDiagnosis from '../utils/SymptomCalculations';
import { steps } from '../data/Steps';
import BotMessages from '../utils/BotMessages';
import useTypingEffect from '../hooks/useTypingEffect';

export const SymptomCheckerContext = createContext();

export const SymptomCheckerProvider = ({ children, initialPatientInfo }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    durationUnit: '',
    severity: '',
    travelRegion: '',
    riskFactors: [],
    drugHistory: [],
    symptoms: [],
    ...initialPatientInfo,
  });
  const [messages, setMessages] = useState([
    { role: 'bot', content: BotMessages.getWelcomeMessage(), isTyping: false }
  ]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [diagnosis, setDiagnosis] = useState([]);
  const [displayedDiagnosis, setDisplayedDiagnosis] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const { startTyping, cancelTyping } = useTypingEffect(setMessages);

  const handlePatientInfoChange = (field, value) => {
    console.log(`Updating ${field} with value: ${JSON.stringify(value)}`); // Debug log
    setPatientInfo((prev) => {
      const newInfo = { ...prev, [field]: value };
      console.log(`New patientInfo: ${JSON.stringify(newInfo)}`); // Debug log
      return newInfo;
    });
    if (field === 'symptoms') {
      setSelectedSymptoms(value);
    }
    const stepIndex = steps.findIndex((s) => s.name === field);
    const nextStep = steps[stepIndex + 1]?.name;
    if (nextStep) {
      if (field === 'symptoms' || field === 'riskFactors') {
        if (Array.isArray(value) && (value.length >= 2 || value.length === 0)) { // Allow empty for 'none'
          console.log(`Advancing from ${field} to ${nextStep}`); // Debug log
          setCurrentStep(nextStep);
          setMessages((prev) => [
            ...prev.filter((msg) => !msg.isTyping),
            { role: 'bot', content: BotMessages.getStepPrompt(nextStep), isTyping: true }
          ]);
          startTyping(BotMessages.getStepPrompt(nextStep));
        } else {
          console.log(`Not advancing from ${field}: insufficient entries (${value.length})`); // Debug log
        }
      } else if (field === 'drugHistory') {
        if (Array.isArray(value)) { // Allow any array (including empty for 'none')
          console.log(`Advancing from ${field} to ${nextStep}`); // Debug log
          setCurrentStep(nextStep);
          setMessages((prev) => [
            ...prev.filter((msg) => !msg.isTyping),
            { role: 'bot', content: BotMessages.getStepPrompt(nextStep), isTyping: true }
          ]);
          startTyping(BotMessages.getStepPrompt(nextStep));
        } else {
          console.log(`Not advancing from ${field}: invalid value ${value}`); // Debug log
        }
      } else {
        console.log(`Advancing from ${field} to ${nextStep}`); // Debug log
        setCurrentStep(nextStep);
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isTyping),
          { role: 'bot', content: BotMessages.getStepPrompt(nextStep), isTyping: true }
        ]);
        startTyping(BotMessages.getStepPrompt(nextStep));
      }
    } else {
      console.log(`No next step found after ${field}`); // Debug log
    }
  };

  const simulateAnalysis = (result) => {
    setAnalysisProgress(0);
    setIsAnalyzing(true);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setDisplayedDiagnosis([]);
          result.forEach((diag, index) => {
            setTimeout(() => {
              setDisplayedDiagnosis((prev) => [...prev, diag]);
            }, index * 500);
          });
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  };

  const handleDiagnosisResults = (result) => {
    if (result.error) {
      setErrorMessage(result.error);
      setDiagnosis([]);
      setDisplayedDiagnosis([]);
      setIsAnalyzing(false);
      return;
    }
    setDiagnosis(result.detailed || []);
    simulateAnalysis(result.detailed || []);
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
        handleDiagnosisResults(result);
      });
    }
  }, [currentStep, selectedSymptoms, patientInfo]);

  useEffect(() => {
    document.body.style.cursor = isAnalyzing ? 'wait' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isAnalyzing]);

  return (
    <SymptomCheckerContext.Provider
      value={{
        selectedSymptoms,
        setSelectedSymptoms,
        patientInfo,
        setPatientInfo,
        messages,
        setMessages,
        currentStep,
        setCurrentStep,
        diagnosis,
        displayedDiagnosis,
        errorMessage,
        setErrorMessage,
        isAnalyzing,
        analysisProgress,
        expandedCard,
        setExpandedCard,
        handlePatientInfoChange,
        startTyping,
        cancelTyping,
      }}
    >
      {children}
    </SymptomCheckerContext.Provider>
  );
};