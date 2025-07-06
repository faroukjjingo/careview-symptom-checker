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
  return (
    <div className="mb-3">
      {currentStep === 'gender' && (
        <select
          value={patientInfo.gender}
          onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        >
          <option value="" disabled>
            Select gender
          </option>
          {['Male', 'Female', 'Other'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {currentStep === 'durationUnit' && (
        <select
          value={patientInfo.durationUnit}
          onChange={(e) => handlePatientInfoChange('durationUnit', e.target.value)}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        >
          <option value="" disabled>
            Select unit
          </option>
          {['Days', 'Weeks', 'Months'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {currentStep === 'severity' && (
        <select
          value={patientInfo.severity}
          onChange={(e) => handlePatientInfoChange('severity', e.target.value)}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        >
          <option value="" disabled>
            Select severity
          </option>
          {['Mild', 'Moderate', 'Severe'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {currentStep === 'travelRegion' && (
        <select
          value={patientInfo.travelRegion}
          onChange={(e) => handlePatientInfoChange('travelRegion', e.target.value)}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        >
          <option value="" disabled>
            Select travel region
          </option>
          {[...Object.keys(travelRiskFactors), 'None'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {currentStep === 'riskFactors' && (
        <div>
          <select
            multiple
            value={patientInfo.riskFactors}
            onChange={(e) =>
              handlePatientInfoChange('riskFactors', Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 h-24 transition-all text-base"
          >
            {Object.keys(riskFactorWeights).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => handlePatientInfoChange('riskFactors', [])}
            className="mt-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 w-full transition-all text-base"
          >
            Skip (No Risk Factors)
          </button>
        </div>
      )}
      {currentStep === 'drugHistory' && (
        <select
          value={patientInfo.drugHistory}
          onChange={(e) => handlePatientInfoChange('drugHistory', e.target.value)}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        >
          <option value="" disabled>
            Select drug history
          </option>
          {Object.keys(drugHistoryWeights).map((option) => (
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