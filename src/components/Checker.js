import React, { useState, useEffect } from 'react';
import SymptomInput from './SymptomInput';
import calculateDiagnosis from './SymptomCalculations';
import { guidance } from './guidance';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DiagnosisCard = ({ diagnosis, probability, confidence, index, isExpanded, onToggle, explanation }) => {
  const guidanceData = guidance[diagnosis.toLowerCase()];
  return (
    <div className="rounded-lg shadow-md mb-4 bg-card">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted"
        onClick={() => onToggle(index)}
      >
        <h3 className="text-lg font-medium text-card-foreground">{diagnosis}</h3>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
              confidence === 'High' ? 'bg-green-500' :
              confidence === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          >
            {confidence}
          </span>
          <span className="text-sm text-muted-foreground">{probability}% Likely</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-border bg-card">
          <h4 className="text-base font-medium text-primary mb-2">Explanation</h4>
          <p className="text-sm text-muted-foreground mb-4">{explanation}</p>
          {guidanceData ? (
            <>
              <h4 className="text-base font-medium text-primary mb-2">Guidance</h4>
              <p className="text-sm text-muted-foreground mb-2"><strong>Next Steps:</strong> {guidanceData.steps}</p>
              <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: guidanceData.content.replace(/\n/g, '<br />') }} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No specific guidance available for {diagnosis}. Consult a healthcare provider for further evaluation.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

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
        return prev + 10;
      });
    }, 200);
  };

  useEffect(() => {
    document.body.style.cursor = isAnalyzing ? 'wait' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isAnalyzing]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">CareView</h1>
        <p className="text-base text-muted-foreground">Input your symptoms to explore potential diagnoses</p>
      </div>

      <SymptomInput onDiagnosisResults={handleDiagnosisResults} />

      {errorMessage && (
        <p className="text-destructive text-center font-medium mt-4">{errorMessage}</p>
      )}

      {diagnosis.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium text-primary mb-4">Diagnosis Results</h2>
          {isAnalyzing ? (
            <div className="flex items-center gap-4 p-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            diagnosis.map((diag, index) => (
              <DiagnosisCard
                key={index}
                diagnosis={diag.diagnosis}
                probability={diag.probability}
                confidence={diag.confidence}
                index={index}
                isExpanded={expandedCard === index}
                onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                explanation={diag.explanation}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Checker;