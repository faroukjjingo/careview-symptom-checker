// src/components/SymptomSelector.jsx
import React from 'react';
import { X } from 'lucide-react';

const SymptomSelector = ({ selectedSymptoms, removeSymptom, suggestions, handleSymptomSelect }) => {
  return (
    <>
      {selectedSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSymptoms.map((symptom) => (
            <div
              key={symptom}
              className="flex items-center px-2 py-1 bg-primary text-primary-foreground rounded-full text-base"
            >
              {symptom}
              <X
                size={14}
                className="ml-1 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => removeSymptom(symptom)}
              />
            </div>
          ))}
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="max-h-32 overflow-y-auto bg-popover border border-border rounded-lg shadow-lg mt-2 p-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-muted transition-colors suggestion-highlight text-base"
              onClick={() => handleSymptomSelect(suggestion)}
            >
              <span
                className={suggestion.type === 'combination' ? 'italic text-muted-foreground' : 'text-foreground'}
              >
                {suggestion.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SymptomSelector;