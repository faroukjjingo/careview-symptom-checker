// src/components/PatientInfoSelector.jsx
import React from 'react';

const PatientInfoSelector = ({
  currentStep,
  patientInfo,
  handlePatientInfoChange,
  setCurrentStep,
  travelRiskFactors,
  riskFactorWeights,
  drugSuggestions,
  handleDrugSelect,
}) => {
  const options = {
    gender: ['Male', 'Female', 'Other'],
    durationUnit: ['Days', 'Weeks', 'Months'],
    severity: ['Mild', 'Moderate', 'Severe'],
    travelRegion: ['None', ...Object.keys(travelRiskFactors)].sort((a, b) => a.localeCompare(b)),
    riskFactors: Object.keys(riskFactorWeights).sort((a, b) => a.localeCompare(b)),
  };

  const steps = [
    { name: 'welcome', validate: (value) => ['start', 'help'].includes(value.toLowerCase()) },
    { name: 'age', validate: (value) => !isNaN(value) && value > 0 && value <= 120 },
    { name: 'gender', validate: (value) => ['male', 'female', 'other'].includes(value.toLowerCase()) },
    { name: 'symptoms', validate: (value) => Array.isArray(value) && value.length >= 2 },
    { name: 'duration', validate: (value) => !isNaN(value) && value > 0 },
    { name: 'durationUnit', validate: (value) => ['days', 'weeks', 'months'].includes(value.toLowerCase()) },
    { name: 'severity', validate: (value) => ['mild', 'moderate', 'severe'].includes(value.toLowerCase()) },
    { name: 'travelRegion', validate: (value, travelRiskFactors) => ['none', ...Object.keys(travelRiskFactors || {})].map(v => v.toLowerCase()).includes(value.toLowerCase()) },
    { name: 'riskFactors', validate: (value, riskFactorWeights) => Array.isArray(value) && (value.length === 0 || value.every((v) => Object.keys(riskFactorWeights || {}).includes(v))) },
    { name: 'drugHistory', validate: (value, drugOptions) => Array.isArray(value) && (value.length === 0 || value.every((v) => drugOptions.includes(v))) },
    { name: 'submit', validate: () => true },
  ];

  const handleSelect = (value) => {
    if (!value) return;

    if (currentStep === 'riskFactors') {
      const currentRiskFactors = patientInfo.riskFactors || [];
      const newRiskFactors = currentRiskFactors.includes(value)
        ? currentRiskFactors
        : [...currentRiskFactors, value];
      handlePatientInfoChange('riskFactors', newRiskFactors);
    } else {
      handlePatientInfoChange(currentStep, value);
      const stepIndex = steps.findIndex((s) => s.name === currentStep);
      const nextStep = steps[stepIndex + 1]?.name;
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  const handleRemoveItem = (field, item) => {
    const updatedItems = patientInfo[field].filter((i) => i !== item);
    handlePatientInfoChange(field, updatedItems);
  };

  return (
    <div className="space-y-2">
      {['gender', 'durationUnit', 'severity', 'travelRegion'].includes(currentStep) && (
        <div className="flex flex-wrap gap-2">
          {options[currentStep].map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`p-2 rounded-lg text-sm transition-all ${
                patientInfo[currentStep] === option
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {currentStep === 'riskFactors' && (
        <div className="flex flex-wrap gap-2">
          {options.riskFactors.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`p-2 rounded-lg text-sm transition-all ${
                patientInfo.riskFactors.includes(option)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {currentStep === 'drugHistory' && drugSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {drugSuggestions.map((drug, index) => (
            <button
              key={index}
              onClick={() => handleDrugSelect(drug)}
              className={`p-2 rounded-lg text-sm transition-all ${
                patientInfo.drugHistory.includes(drug)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
              }`}
            >
              {drug}
            </button>
          ))}
        </div>
      )}
      {(currentStep === 'riskFactors' || currentStep === 'drugHistory') && patientInfo[currentStep].length > 0 && (
        <div className="flex flex-wrap gap-2">
          {patientInfo[currentStep].map((item, index) => (
            <span
              key={index}
              className="p-2 bg-primary text-primary-foreground rounded-lg text-sm flex items-center"
            >
              {item}
              <button
                onClick={() => handleRemoveItem(currentStep, item)}
                className="ml-2 text-primary-foreground hover:text-red-500"
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
            if (currentStep === 'riskFactors' || currentStep === 'drugHistory') {
              handlePatientInfoChange(currentStep, []);
            } else {
              handlePatientInfoChange(currentStep, 'None');
            }
            const stepIndex = steps.findIndex((s) => s.name === currentStep);
            const nextStep = steps[stepIndex + 1]?.name;
            if (nextStep) {
              setCurrentStep(nextStep);
            }
          }}
          className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all text-sm"
        >
          {currentStep === 'riskFactors' || currentStep === 'drugHistory' ? 'Done' : 'Skip'}
        </button>
      )}
    </div>
  );
};

export default PatientInfoSelector;