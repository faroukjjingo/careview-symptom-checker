import React, { useContext } from 'react';
import { SymptomCheckerContext } from '../context/SymptomCheckerContext';

const DiagnosisCard = ({ guidance }) => {
  const { diagnosis, isAnalyzing, analysisProgress, displayedDiagnosis, isTyping, expandedCard, setExpandedCard } = useContext(SymptomCheckerContext);

  return (
    <>
      {diagnosis.length > 0 && (
        <>
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
                <div
                  key={index}
                  className="p-4 bg-card border border-border rounded-lg"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold">{diag.diagnosis}</h3>
                    <span>{`${(diag.probability * 100).toFixed(1)}%`}</span>
                  </div>
                  {expandedCard === index && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p><strong>Confidence:</strong> {(diag.confidence * 100).toFixed(1)}%</p>
                      <p><strong>Explanation:</strong> {diag.explanation}</p>
                      <p><strong>Guidance:</strong> {guidance[diag.diagnosis.toLowerCase()] || 'Consult a healthcare professional.'}</p>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="text-sm text-muted-foreground italic">Generating more diagnoses...</div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DiagnosisCard;