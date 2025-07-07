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
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    if (field === 'symptoms') {
      setSelectedSymptoms(value);
    }
    if (field !== 'symptoms' && field !== 'riskFactors' && field !== 'drugHistory') {
      const stepIndex = steps.findIndex((s) => s.name === field);
      const nextStep = steps[stepIndex + 1]?.name;
      if (nextStep) {
        setCurrentStep(nextStep);
        startTyping(BotMessages.getStepPrompt(nextStep));
      }
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