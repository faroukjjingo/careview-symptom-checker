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
    travelRegion: ['None', ...Object.keys(travelRiskFactors)].sort((a, b) => a.localeCompare(b)),
    riskFactors: Object.keys(riskFactorWeights).sort((a, b) => a.localeCompare(b)),
    drugHistory: ['None', ...Object.keys(drugHistoryWeights)].sort((a, b) => a.localeCompare(b)),
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    if (currentStep === 'riskFactors') {
      const currentRiskFactors = patientInfo.riskFactors || [];
      const newRiskFactors = currentRiskFactors.includes(value)
        ? currentRiskFactors
        : [...currentRiskFactors, value];
      handlePatientInfoChange('riskFactors', newRiskFactors);
    } else {
      handlePatientInfoChange(currentStep, value);
    }
  };

  return (
    <div className="space-y-2">
      {currentStep !== 'age' && currentStep !== 'duration' && (
        <select
          onChange={handleSelect}
          value=""
          multiple={currentStep === 'riskFactors'}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        >
          <option value="" disabled>
            Select {currentStep}
          </option>
          {options[currentStep].map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {currentStep === 'riskFactors' && (
        <div className="flex flex-wrap gap-2">
          {(patientInfo.riskFactors || []).map((risk, index) => (
            <span
              key={index}
              className="p-2 bg-secondary text-secondary-foreground rounded-lg text-sm"
            >
              {risk}
              <button
                onClick={() => {
                  const updatedRiskFactors = patientInfo.riskFactors.filter((r) => r !== risk);
                  handlePatientInfoChange('riskFactors', updatedRiskFactors);
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {['travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) && (
        <button
          onClick={() => {
            if (currentStep === 'riskFactors') {
              handlePatientInfoChange('riskFactors', []);
            } else {
              handlePatientInfoChange(currentStep, 'None');
            }
          }}
          className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all text-sm"
        >
          Skip
        </button>
      )}
    </div>
  );
};

export default PatientInfoSelector;