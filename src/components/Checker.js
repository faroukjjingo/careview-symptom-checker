import React, { useState, useEffect } from 'react';
import SymptomInput from './SymptomInput';
import DiagnosisCard from './DiagnosisCard';
import calculateDiagnosis from './SymptomCalculations';
import { guidance } from './guidance';

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
  });
  const [diagnosis, setDiagnosis] = useState([]);
  const [errorMessage, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleDiagnosisResults = (result) => {
    if (result.error) {
      setError(result.error);
      setDiagnosis([]);
      setIsAnalyzing(false);
      return;
    }
    simulateAnalysis(result);
  };

  const simulateAnalysis = (result) => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setDiagnosis(result.detailed);
          if (result.redFlag) setError(result.redFlag);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  useEffect(() => {
    document.body.style.cursor = isAnalyzing ? 'wait' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isAnalyzing]);

  return (
<div className="min-h-screen w-full px-1 py-1">
      <div className="mb-2 text-center">
        <h1 className="text-xl font-bold text-primary">CareView Symptom Checker</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Developed by trusted healthcare professionals to explore possible diagnoses. Always consult a doctor for medical advice.</p>
      </div>

      <SymptomInput 
        selectedSymptoms={selectedSymptoms}
        setSelectedSymptoms={setSelectedSymptoms}
        patientInfo={patientInfo}
        setPatientInfo={setPatientInfo}
        onDiagnosisResults={handleDiagnosisResults}
      />

      {errorMessage && (
        <div className="mt-1 p-2 bg-destructive/10 text-destructive rounded-lg text-center">
          <p className="font-medium text-xs">{errorMessage}</p>
          <p className="text-xs mt-0.5">Please consult a healthcare provider immediately for serious symptoms.</p>
        </div>
      )}

      {diagnosis.length > 0 && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold text-primary mb-1">Possible Diagnoses</h2>
          {isAnalyzing ? (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <div className="w-5 h-5 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Analyzing your symptoms...</p>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {diagnosis.map((diag, index) => (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checker;