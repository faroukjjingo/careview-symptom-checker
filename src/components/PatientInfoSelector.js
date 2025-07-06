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

  const renderButtons = (step) => (
    <div className="flex flex-wrap gap-2">
      {options[step].map((option) => (
        <button
          key={option}
          onClick={() => handlePatientInfoChange(step, step === 'riskFactors' ? [option] : option)}
          className={`p-2 rounded-lg ${
            (step === 'riskFactors' ? patientInfo.riskFactors.includes(option) : patientInfo[step] === option)
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
      {['gender', 'durationUnit', 'severity', 'travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) &&
        renderButtons(currentStep)}
    </div>
  );
};

export default PatientInfoSelector;