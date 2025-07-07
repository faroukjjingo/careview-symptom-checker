import React, { useContext, useRef } from 'react';
import { Send } from 'lucide-react';
import { SymptomCheckerContext } from '../context/SymptomCheckerContext';
import PatientInfoSelector from './PatientInfoSelector';
import useSymptomInput from '../hooks/useSymptomInput';

const SymptomInput = () => {
  const { currentStep, patientInfo, setMessages, handlePatientInfoChange } = useContext(SymptomCheckerContext);
  const { input, setInput, suggestions, drugSuggestions, handleInputChange, handleSymptomSelect, handleDrugSelect, handleSubmit } = useSymptomInput();
  const inputRef = useRef(null);

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
      {(currentStep === 'symptoms' && suggestions.length > 0) || (currentStep === 'drugHistory' && drugSuggestions.length > 0) ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {(currentStep === 'symptoms' ? suggestions : drugSuggestions).map((item, index) => (
              <button
                key={index}
                onClick={() => currentStep === 'symptoms' ? handleSymptomSelect(item) : handleDrugSelect(item)}
                className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all text-sm"
              >
                {item.text || item}
              </button>
            ))}
            <button
              onClick={() => handleSubmit({ target: { value: 'done' } })}
              className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all text-sm"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
      {['gender', 'durationUnit', 'severity', 'travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) && (
        <PatientInfoSelector />
      )}
      {currentStep !== 'submit' && (
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              currentStep === 'welcome'
                ? 'Type "start" or "help"'
                : currentStep === 'symptoms'
                ? 'Type symptoms or "done"'
                : currentStep === 'drugHistory'
                ? 'Type drug name, "done", or "none"'
                : currentStep === 'riskFactors'
                ? 'Type risk factors, "done", or "none"'
                : currentStep === 'travelRegion'
                ? 'Type region or "none"'
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