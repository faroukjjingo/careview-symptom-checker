// src/components/PatientInfoSelector.jsx
import React, { useState } from 'react';

const PatientInfoSelector = ({
  currentStep,
  patientInfo,
  handlePatientInfoChange,
  travelRiskFactors,
  riskFactorWeights,
  drugHistoryWeights,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getOptions = () => {
    let options = [];
    if (currentStep === 'age' || currentStep === 'duration') {
      return []; // Text input handled by SymptomInput
    } else if (currentStep === 'gender') {
      options = ['Male', 'Female', 'Other'];
    } else if (currentStep === 'durationUnit') {
      options = ['Days', 'Weeks', 'Months'];
    } else if (currentStep === 'severity') {
      options = ['Mild', 'Moderate', 'Severe'];
    } else if (currentStep === 'travelRegion') {
      options = ['None', ...Object.keys(travelRiskFactors)]
        .filter((region) => region.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
    } else if (currentStep === 'riskFactors') {
      options = Object.keys(riskFactorWeights)
        .filter((risk) => risk.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
    } else if (currentStep === 'drugHistory') {
      options = ['None', ...Object.keys(drugHistoryWeights)]
        .filter((drug) => drug.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
    }
    return options;
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
    setSearchTerm('');
  };

  return (
    <div className="space-y-2">
      {['travelRegion', 'riskFactors', 'drugHistory'].includes(currentStep) && (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${currentStep}`}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-base"
        />
      )}
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
          {getOptions().map((option, index) => (
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