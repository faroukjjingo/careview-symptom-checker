import React, { useState } from 'react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import './SymptomInput.css';

const Select = ({ label, value, options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="input-group">
      {label && <label className="label">{label}</label>}
      <div className="select-button" onClick={() => setIsOpen(!isOpen)}>
        <span className={value ? 'select-text' : 'placeholder-text'}>
          {value || placeholder}
        </span>
        <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="options-container">
          {options.map((option) => (
            <div
              key={option}
              className={`option ${value === option ? 'selected-option' : ''}`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <span className={`option-text ${value === option ? 'selected-option-text' : ''}`}>
                {option}
              </span>
              {value === option && <span className="check-icon">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SymptomInput = ({ onSelectSymptoms, patientInfo, onPatientInfoChange }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInput(text);
    if (text.trim()) {
      const filteredSymptoms = symptomList
        .filter(
          (symptom) =>
            symptom.toLowerCase().includes(text.toLowerCase()) &&
            !selectedSymptoms.includes(symptom)
        )
        .slice(0, 5);

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
        .slice(0, 5);

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
    } else {
      setSuggestions([]);
    }
  };

  const handleSymptomSelect = (suggestion) => {
    let symptomsToAdd = [];
    if (suggestion.type === 'combination') {
      symptomsToAdd = suggestion.symptoms;
    } else {
      symptomsToAdd = [suggestion.text];
    }

    const uniqueNewSymptoms = symptomsToAdd.filter(
      (symptom) => !selectedSymptoms.includes(symptom)
    );

    if (uniqueNewSymptoms.length > 0) {
      const updatedSymptoms = [...selectedSymptoms, ...uniqueNewSymptoms];
      setSelectedSymptoms(updatedSymptoms);
      onSelectSymptoms(updatedSymptoms);
    }

    setInput('');
    setSuggestions([]);
  };

  const removeSymptom = (symptomToRemove) => {
    const updatedSymptoms = selectedSymptoms.filter((s) => s !== symptomToRemove);
    setSelectedSymptoms(updatedSymptoms);
    onSelectSymptoms(updatedSymptoms);
  };

  return (
    <div className="symptom-input-container">
      <div className="input-group">
        <label className="label">Age</label>
        <input
          className="input"
          placeholder="Enter your age"
          type="number"
          value={patientInfo.age}
          onChange={(e) => onPatientInfoChange('age', e.target.value)}
        />
      </div>

      <Select
        label="Gender"
        value={patientInfo.gender}
        options={['Male', 'Female', 'Other']}
        onSelect={(value) => onPatientInfoChange('gender', value)}
        placeholder="Select your gender"
      />

      <div className="input-group">
        <label className="label">Symptoms</label>
        <input
          className="input"
          placeholder="Type to search symptoms..."
          value={input}
          onChange={handleInputChange}
        />

        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`suggestion ${
                  suggestion.type === 'combination' ? 'combination-suggestion' : ''
                }`}
                onClick={() => handleSymptomSelect(suggestion)}
              >
                <span
                  className={`suggestion-text ${
                    suggestion.type === 'combination' ? 'combination-text' : ''
                  }`}
                >
                  {suggestion.type === 'combination' ? '🔗 ' : ''}
                  {suggestion.text}
                </span>
                <span className="add-icon">+</span>
              </div>
            ))}
          </div>
        )}

        {selectedSymptoms.length > 0 && (
          <div className="selected-container">
            {selectedSymptoms.map((symptom) => (
              <div key={symptom} className="selected-symptom">
                <span className="selected-symptom-text">{symptom}</span>
                <span className="remove-icon" onClick={() => removeSymptom(symptom)}>
                  ✕
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="row-container">
        <div className="input-group duration-input">
          <label className="label">Duration</label>
          <input
            className="input"
            placeholder="Enter number"
            type="number"
            value={patientInfo.duration}
            onChange={(e) => onPatientInfoChange('duration', e.target.value)}
          />
        </div>

        <div className="input-group duration-unit">
          <label className="label">&nbsp;</label>
          <Select
            value={patientInfo.durationUnit}
            options={['Days', 'Weeks', 'Months']}
            onSelect={(value) => onPatientInfoChange('durationUnit', value)}
            placeholder="Unit"
          />
        </div>
      </div>

      <Select
        label="Severity"
        value={patientInfo.severity}
        options={['Mild', 'Moderate', 'Severe']}
        onSelect={(value) => onPatientInfoChange('severity', value)}
        placeholder="Select severity level"
      />
    </div>
  );
};

export default SymptomInput;
