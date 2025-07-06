import React from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const DiagnosisCard = ({ diagnosis, probability, confidence, index, isExpanded, onToggle, explanation, guidance }) => {
  return (
    <div className="rounded-lg shadow-lg bg-card border border-border transition-all duration-200 hover:shadow-xl">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
        onClick={() => onToggle(index)}
      >
        <h3 className="text-lg font-semibold text-card-foreground">{diagnosis}</h3>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
              confidence === 'High' ? 'bg-green-600' :
              confidence === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
            }`}
          >
            {confidence} Confidence
          </span>
          <span className="text-sm text-muted-foreground">{probability}% Likely</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-border bg-card/50">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-primary mb-2">Why This Diagnosis?</h4>
            <p className="text-sm text-muted-foreground prose">{explanation}</p>
          </div>
          {guidance ? (
            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Next Steps</h4>
              <p className="text-sm text-muted-foreground mb-2"><strong>Recommended Actions:</strong> {guidance.steps}</p>
              <div className="text-sm text-muted-foreground prose" dangerouslySetInnerHTML={{ __html: guidance.content.replace(/\n/g, '<br />') }} />
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm text-muted-foreground italic">
              <AlertCircle size={16} className="mt-1" />
              <p>No specific guidance available for {diagnosis}. Please consult a healthcare provider for a thorough evaluation.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosisCard;