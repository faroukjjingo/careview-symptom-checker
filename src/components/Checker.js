// src/components/Checker.jsx
import React, { useState, useEffect } from 'react';
import SymptomInput from './SymptomInput';
import SymptomChat from './SymptomChat';
import DiagnosisCard from './DiagnosisCard';
import calculateDiagnosis from './SymptomCalculations';
import { guidance } from './guidance';
import { travelRiskFactors } from './TravelRiskFactors';
import { riskFactorWeights } from './RiskFactorWeights';
import drugHistoryWeights from './DrugHistoryWeights';

const Checker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    durationUnit: '',
    severity: '',
    travelRegion: '',
    riskFactors: [],
    drugHistory: '',
    travelRiskFactors,
    riskFactorWeights,
    drugHistoryWeights,
  });
  const [messages, setMessages] = useState([{ role: 'bot', content: 'Hi there! I’m Dr. Jjingo, your symptom checker assistant. Type "start" to begin or "help" for guidance.', isTyping: false }]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [errorMessage, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [displayedDiagnosis, setDisplayedDiagnosis] = useState([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const handleDiagnosisResults = (result) => {
    if (result.error) {
      setError(result.error);
      setDiagnosis([]);
      setDisplayedDiagnosis([]);
      setIsAnalyzing(false);
      return;
    }
    setDiagnosis(result.detailed || []);
    simulateAnalysis(result.detailed || []);
  };

  const simulateAnalysis = (result) => {
    setAnalysisProgress(0);
    setIsAnalyzing(true);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setIsTyping(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  useEffect(() => {
    if (isTyping && diagnosis.length > 0 && typingIndex < diagnosis.length) {
      const timer = setTimeout(() => {
        setDisplayedDiagnosis((prev) => [...prev, diagnosis[typingIndex]]);
        setTypingIndex((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (typingIndex >= diagnosis.length) {
      setIsTyping(false);
    }
  }, [isTyping, typingIndex, diagnosis]);

  useEffect(() => {
    document.body.style.cursor = isAnalyzing ? 'wait' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isAnalyzing]);

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">CareView Symptom Checker</h1>
        <p className="text-sm text-muted-foreground mt-2">Developed by trusted healthcare professionals to explore possible diagnoses. Always consult a doctor for medical advice.</p>
      </div>

      <SymptomChat messages={messages} error={errorMessage} />

      <SymptomInput
        selectedSymptoms={selectedSymptoms}
        setSelectedSymptoms={setSelectedSymptoms}
        patientInfo={patientInfo}
        setPatientInfo={setPatientInfo}
        onDiagnosisResults={handleDiagnosisResults}
        messages={messages}
        setMessages={setMessages}
        travelRiskFactors={travelRiskFactors}
        riskFactorWeights={riskFactorWeights}
        drugHistoryWeights={drugHistoryWeights}
      />

      {diagnosis.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary">Possible Diagnoses</h2>
          {isAnalyzing ? (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Analyzing your symptoms...</p>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedDiagnosis.map((diag, index) => (
                <DiagnosisCard
                  key={index}
                  diagnosis={diag.diagnosis}
                  probability={diag.probability}
                  confidence={diag.confidence}
                  index={index}
                  isExpanded={expandedCard === index}
                  onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                  explanation={diag.explanation}
                  guidance={guidance[diag.diagnosis.toLowerCase()]}
                />
              ))}
              {isTyping && (
                <div className="text-sm text-muted-foreground italic">Generating more diagnoses...</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checker;