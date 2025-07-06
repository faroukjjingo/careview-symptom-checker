import React, { useState } from 'react';
import { Plus, X, Link } from 'lucide-react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import { travelRiskFactors } from './TravelRiskFactors';
import { riskFactorWeights } from './RiskFactorWeights';
import drugHistoryWeights from './DrugHistoryWeights';
import { calculateDiagnosis } from './SymptomCalculations';

const SymptomInput = ({ onDiagnosisResults }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    durationUnit: '',
    severity: '',
    travelRegion: '',
    riskFactors: [],
    drugHistory: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInput(text);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const availableSymptoms = Array.isArray(symptomList)
      ? symptomList
      : Object.keys(symptomList);

    const filteredSymptoms = availableSymptoms
      .filter(
        (symptom) =>
          symptom.toLowerCase().includes(text.toLowerCase()) &&
          !selectedSymptoms.includes(symptom)
      )
      .slice(0, 8);

    const combinationKeys = Object.keys(symptomCombinations);
    const filteredCombinations = combinationKeys
      .filter((combination) => {
        const symptoms = combination.split(', ');
        return (
          symptoms.some((symptom) =>
            symptom.toLowerCase().includes(text.toLowerCase())
          ) && symptoms.some((symptom) => !selectedSymptoms.includes(symptom))
        );
      })
      .slice(0, 4);

    const combinedSuggestions = [
      ...filteredCombinations.map((combination) => ({
        type: 'combination',
        text: combination,
        symptoms: combination.split(', '),
      })),
      ...filteredSymptoms.map((symptom) => ({
        type: 'single',
        text: symptom,
      })),
    ];

    setSuggestions(combinedSuggestions);
  };

  const handleSymptomSelect = (suggestion) => {
    let symptomsToAdd = suggestion.type === 'combination' ? suggestion.symptoms : [suggestion.text];
    const uniqueNewSymptoms = symptomsToAdd.filter((symptom) => !selectedSymptoms.includes(symptom));

    if (uniqueNewSymptoms.length > 0) {
      const updatedSymptoms = [...selectedSymptoms, ...uniqueNewSymptoms];
      setSelectedSymptoms(updatedSymptoms);
      setError('');
    }

    setInput('');
    setSuggestions([]);
  };

  const removeSymptom = (symptomToRemove) => {
    const updatedSymptoms = selectedSymptoms.filter((s) => s !== symptomToRemove);
    setSelectedSymptoms(updatedSymptoms);
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!patientInfo.age || isNaN(parseInt(patientInfo.age))) {
      setError('Age is required and must be a valid number');
      return;
    }
    if (!patientInfo.gender) {
      setError('Gender is required');
      return;
    }
    if (selectedSymptoms.length < 2) {
      setError('At least two symptoms are required');
      return;
    }
    if (!patientInfo.duration || isNaN(parseInt(patientInfo.duration))) {
      setError('Duration is required and must be a valid number');
      return;
    }
    if (!patientInfo.durationUnit) {
      setError('Duration unit is required');
      return;
    }
    if (!patientInfo.severity) {
      setError('Severity is required');
      return;
    }
    if (!patientInfo.travelRegion) {
      setError('Travel region is required');
      return;
    }
    if (!patientInfo.drugHistory) {
      setError('Drug history is required');
      return;
    }

    const result = await calculateDiagnosis(
      selectedSymptoms,
      parseInt(patientInfo.duration),
      patientInfo.durationUnit,
      patientInfo.severity,
      patientInfo.age,
      patientInfo.gender,
      patientInfo.drugHistory,
      patientInfo.travelRegion,
      patientInfo.riskFactors
    );

    onDiagnosisResults(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {error && (
        <p className="text-destructive mb-4 text-center">{error}</p>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Age</label>
        <input
          type="number"
          value={patientInfo.age}
          onChange={(e) => handlePatientInfoChange('age', e.target.value)}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Enter age"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Gender</label>
        <select
          value={patientInfo.gender}
          onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          required
        >
          <option value="" disabled>Select gender</option>
          {['Male', 'Female', 'Other'].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-foreground mb-1">Symptoms</label>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-full p-2 pr-10 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Type to search symptoms..."
            required
          />
          <Plus size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary" />
        </div>
        {suggestions.length > 0 && (
          <div className="absolute w-full max-h-60 overflow-y-auto bg-background border border-border rounded-md shadow-md mt-1 z-10">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center p-2 cursor-pointer hover:bg-muted suggestion-highlight"
                onClick={() => handleSymptomSelect(suggestion)}
              >
                {suggestion.type === 'combination' && (
                  <Link size={16} className="mr-2 text-primary" />
                )}
                <span className={suggestion.type === 'combination' ? 'italic' : ''}>{suggestion.text}</span>
              </div>
            ))}
          </div>
        )}
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedSymptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
              >
                {symptom}
                <X
                  size={16}
                  className="ml-2 cursor-pointer hover:text-destructive"
                  onClick={() => removeSymptom(symptom)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-4 flex-col sm:flex-row">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
          <input
            type="number"
            value={patientInfo.duration}
            onChange={(e) => handlePatientInfoChange('duration', e.target.value)}
            className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Enter number"
            required
          />
        </div>
        <div className="w-full sm:w-32">
          <label className="block text-sm font-medium text-foreground mb-1">Duration Unit</label>
          <select
            value={patientInfo.durationUnit}
            onChange={(e) => handlePatientInfoChange('durationUnit', e.target.value)}
            className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            required
          >
            <option value="" disabled>Unit</option>
            {['Days', 'Weeks', 'Months'].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Severity</label>
        <select
          value={patientInfo.severity}
          onChange={(e) => handlePatientInfoChange('severity', e.target.value)}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          required
        >
          <option value="" disabled>Select severity</option>
          {['Mild', 'Moderate', 'Severe'].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Travel Region</label>
        <select
          value={patientInfo.travelRegion}
          onChange={(e) => handlePatientInfoChange('travelRegion', e.target.value)}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          required
        >
          <option value="" disabled>Select travel region</option>
          {Object.keys(travelRiskFactors).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Risk Factors</label>
        <select
          multiple
          value={patientInfo.riskFactors}
          onChange={(e) => handlePatientInfoChange('riskFactors', Array.from(e.target.selectedOptions, (option) => option.value))}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary h-24"
        >
          {Object.keys(riskFactorWeights).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Drug History</label>
        <select
          value={patientInfo.drugHistory}
          onChange={(e) => handlePatientInfoChange('drugHistory', e.target.value)}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          required
        >
          <option value="" disabled>Select drug history</option>
          {Object.keys(drugHistoryWeights).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full p-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        Get Diagnosis
      </button>
    </div>
  );
};

export default SymptomInput;