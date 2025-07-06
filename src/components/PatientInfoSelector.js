// src/components/PatientInfoSelector.jsx
import React from 'react';

const PatientInfoSelector = ({
  currentStep,
  patientInfo,
  handlePatientInfoChange,
  travelRiskFactors,
  riskFactorWeights,
  drugHistoryWeights,
}) => {
  const options = {
    gender: ['Male', 'Female', 'Other'],
    durationUnit: ['Days', 'Weeks', 'Months'],
    severity: ['Mild', 'Moderate', 'Severe'],
    travelRegion: [...Object.keys(travelRiskFactors), 'None'],
    riskFactors: Object.keys(riskFactorWeights),
    drugHistory: Object.keys(drugHistoryWeights),
  };

  const handleRiskFactorToggle = (option) => {
    const currentRiskFactors = patientInfo.riskFactors || [];
    const updatedRiskFactors = currentRiskFactors.includes(option)
      ? currentRiskFactors.filter((factor) => factor !== option)
      : [...currentRiskFactors, option];
    handlePatientInfoChange('riskFactors', updatedRiskFactors);
  };

  const renderButtons = (step) => (
    <div className="flex flex-wrap gap-2">
      {options[step].map((option) => (
        <button
          key={option}
          onClick={() => (step === 'riskFactors' ? handleRiskFactorToggle(option) : handlePatientInfoChange(step, option))}
          className={`p-2 rounded-lg ${
            step === 'riskFactors'
              ? patientInfo.riskFactors.includes(option)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
              : patientInfo[step] === option
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
          } transition-all text-base`}
        >
          {option}
        </button>
      ))}
      {step === 'riskFactors' && (
        <button
          onClick={() => handlePatientInfoChange('riskFactors', [])}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-base"
        >
          Skip (No Risk Factors)
        </button>
      )}
    </div>
  );

  return (
    <div className="mb-3">
      {['gender', 'durationUnit', 'severity', 'travelRegion', 'riskFactors'].includes(currentStep) && renderButtons(currentStep)}
      {currentStep === 'drugHistory' && (
        <select
          value={patientInfo.drugHistory}
          onChange={(e) => handlePatientInfoChange('drugHistory', e.target.value)}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        >
          <option value="" disabled>
            Select drug history
          </option>
          {options.drugHistory.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default PatientInfoSelector;