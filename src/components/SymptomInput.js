import React, { useState, useEffect } from 'react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import './SymptomInput.css';

const Select = ({ label, value, options, onSelect, placeholder, id }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="input-group">
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className="select-button"
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <span className={value ? 'select-text' : 'placeholder-text'}>
          {value || placeholder}
        </span>
        <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="options-container" id={`${id}-options`}>
          {options.map((option) => (
            <div
              key={option}
              className={`option ${value === option ? 'selected-option' : ''}`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (onSelect(option), setIsOpen(false))}
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

const BodyMap = ({ onRegionSelect }) => {
  const regions = [
    { id: 'head', label: 'Head' },
    { id: 'chest', label: 'Chest' },
    { id: 'abdomen', label: 'Abdomen' },
    { id: 'limbs', label: 'Arms/Legs' },
  ];

  return (
    <div className="body-map-container">
      <h3 className="body-map-title">Select Body Region</h3>
      <div className="body-map">
        {regions.map((region) => (
          <button
            key={region.id}
            className="body-region"
            onClick={() => onRegionSelect(region.id)}
            aria-label={`Select ${region.label} region`}
          >
            {region.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const SymptomInput = ({ onSelectSymptoms, patientInfo, onPatientInfoChange, language }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [errors, setErrors] = useState({ age: '', duration: '' });

  // Validate inputs
  const validateInput = (field, value) => {
    if (field === 'age') {
      const num = parseInt(value);
      if (value && (isNaN(num) || num < 0 || num > 120)) {
        setErrors((prev) => ({ ...prev, age: 'Enter a valid age (0-120)' }));
      } else {
        setErrors((prev) => ({ ...prev, age: '' }));
      }
    }
    if (field === 'duration') {
      const num = parseInt(value);
      if (value && (isNaN(num) || num < 0)) {
        setErrors((prev) => ({ ...prev, duration: 'Enter a valid duration (0+)' }));
      } else {
        setErrors((prev) => ({ ...prev, duration: '' }));
      }
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInput(text);
    if (text.trim()) {
      const filteredSymptoms = Object.keys(symptomList)
        .filter(
          (symptom) =>
            symptomList[symptom][language]
              .toLowerCase()
              .includes(text.toLowerCase()) &&
            !selectedSymptoms.includes(symptom) &&
            (!selectedRegion || symptomList[symptom].region === selectedRegion)
        )
        .slice(0, 5);

      const combinationKeys = Object.keys(symptomCombinations);
      const filteredCombinations = combinationKeys
        .filter((combination) => {
          const symptoms = combination.split(', ');
          return (
            symptoms.some((symptom) =>
              symptomList[symptom]?.[language]
                ?.toLowerCase()
                .includes(text.toLowerCase())
            ) &&
            symptoms.some((symptom) => !selectedSymptoms.includes(symptom)) &&
            (!selectedRegion ||
              symptoms.every((symptom) => symptomList[symptom]?.region === selectedRegion))
          );
        })
        .slice(0, 5);

      const combinedSuggestions = [
        ...filteredCombinations.map((combination) => ({
          type: 'combination',
          text: combination
            .split(', ')
            .map((s) => symptomList[s]?.[language] || s)
            .join(', '),
          symptoms: combination.split(', '),
        })),
        ...filteredSymptoms.map((symptom) => ({
          type: 'single',
          text: symptomList[symptom][language],
          symptomKey: symptom,
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
      symptomsToAdd = [suggestion.symptomKey];
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

  const handleRegionSelect = (region) => {
    setSelectedRegion(region === selectedRegion ? null : region);
    setSuggestions([]);
    setInput('');
  };

  return (
    <div className="symptom-input-container">
      <BodyMap onRegionSelect={handleRegionSelect} />

      <div className="input-group">
        <label className="label" htmlFor="age-input">
          Age
        </label>
        <input
          id="age-input"
          className={`input ${errors.age ? 'input-error' : ''}`}
          placeholder="Enter your age"
          type="number"
          value={patientInfo.age}
          onChange={(e) => {
            onPatientInfoChange('age', e.target.value);
            validateInput('age', e.target.value);
          }}
          aria-invalid={!!errors.age}
          aria-describedby={errors.age ? 'age-error' : undefined}
        />
        {errors.age && (
          <span className="error-text" id="age-error">
            {errors.age}
          </span>
        )}
      </div>

      <Select
        label="Gender"
        value={patientInfo.gender}
        options={['Male', 'Female', 'Other']}
        onSelect={(value) => onPatientInfoChange('gender', value)}
        placeholder="Select your gender"
        id="gender-select"
      />

      <div className="input-group">
        <label className="label" htmlFor="symptom-input">
          Symptoms
        </label>
        <input
          id="symptom-input"
          className="input"
          placeholder="Type to search symptoms..."
          value={input}
          onChange={handleInputChange}
          aria-autocomplete="list"
          aria-controls="suggestions-container"
        />

        {suggestions.length > 0 && (
          <div className="suggestions-container" id="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`suggestion ${
                  suggestion.type === 'combination' ? 'combination-suggestion' : ''
                }`}
                onClick={() => handleSymptomSelect(suggestion)}
                role="option"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSymptomSelect(suggestion)}
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
                <span className="selected-symptom-text">
                  {symptomList[symptom]?.[language] || symptom}
                </span>
                <span
                  className="remove-icon"
                  onClick={() => removeSymptom(symptom)}
                  role="button"
                  aria-label={`Remove ${symptomList[symptom]?.[language] || symptom}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && removeSymptom(symptom)}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="row-container">
        <div className="input-group duration-input">
          <label className="label" htmlFor="duration-input">
            Duration
          </label>
          <input
            id="duration-input"
            className={`input ${errors.duration ? 'input-error' : ''}`}
            placeholder="Enter number"
            type="number"
            value={patientInfo.duration}
            onChange={(e) => {
              onPatientInfoChange('duration', e.target.value);
              validateInput('duration', e.target.value);
            }}
            aria-invalid={!!errors.duration}
            aria-describedby={errors.duration ? 'duration-error' : undefined}
          />
          {errors.duration && (
            <span className="error-text" id="duration-error">
              {errors.duration}
            </span>
          )}
        </div>

        <div className="input-group duration-unit">
          <label className="label" htmlFor="duration-unit-select">
            Duration Unit
          </label>
          <Select
            value={patientInfo.durationUnit}
            options={['Days', 'Weeks', 'Months']}
            onSelect={(value) => onPatientInfoChange('durationUnit', value)}
            placeholder="Unit"
            id="duration-unit-select"
          />
        </div>
      </div>

      <div className="input-group">
        <label className="label" htmlFor="severity-slider">
          Severity (1-10)
        </label>
        <input
          id="severity-slider"
          type="range"
          min="1"
          max="10"
          value={patientInfo.severity || 1}
          onChange={(e) => onPatientInfoChange('severity', e.target.value)}
          className="severity-slider"
          aria-valuemin="1"
          aria-valuemax="10"
          aria-valuenow={patientInfo.severity || 1}
        />
        <div className="severity-labels">
          <span>1 (Mild)</span>
          <span>{patientInfo.severity || 1}</span>
          <span>10 (Severe)</span>
        </div>
      </div>
    </div>
  );
};

export default SymptomInput;
