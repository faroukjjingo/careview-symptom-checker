import React, { useContext } from 'react';
import { SymptomCheckerContext } from '../context/SymptomCheckerContext';

const PatientInfoSelector = () => {
  const { currentStep, patientInfo, handlePatientInfoChange } = useContext(SymptomCheckerContext);

  const options = {
    gender: ['Male', 'Female', 'Other'],
    durationUnit: ['Days', 'Weeks', 'Months'],
    severity: ['Mild', 'Moderate', 'Severe'],
    travelRegion: ['None', ...Object.keys(patientInfo.travelRiskFactors || {})],
    riskFactors: Object.keys(patientInfo.riskFactorWeights || {}),
    drugHistory: patientInfo.drugHistoryWeights || [],
  };

  const handleSelect = (value) => {
    handlePatientInfoChange(currentStep, value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
      </label>
      <select
        value={patientInfo[currentStep] || ''}
        onChange={(e) => handleSelect(e.target.value)}
        className="p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base w-full"
      >
        <option value="" disabled>Select an option</option>
        {options[currentStep].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PatientInfoSelector;