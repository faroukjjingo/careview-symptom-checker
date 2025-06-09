import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Link } from 'lucide-react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import './SymptomInput.css';

const CustomSelect = ({ label, value, options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="input-group">
      <label>{label}</label>
      <div
        className="select-button"
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <span className={value ? 'select-text' : 'placeholder-text'}>
          {value || placeholder}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isOpen && (
        <div className="options-container">
          {options.map((option) => (
            <div
              key={option}
              className={`option-item ${value === option ? 'selected' : ''}`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (onSelect(option), setIsOpen(false))}
            >
              <span>{option}</span>
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
        <label htmlFor="age-input">Age</label>
        <input
          id="age-input"
          type="number"
          value={patientInfo.age}
          onChange={(e) => onPatientInfoChange('age', e.target.value)}
          placeholder="Enter your age"
        />
      </div>

      <CustomSelect
        label="Gender"
        value={patientInfo.gender}
        options={['Male', 'Female', 'Other']}
        onSelect={(value) => onPatientInfoChange('gender', value)}
        placeholder="Select your gender"
      />

      <div className="input-group">
        <label htmlFor="symptom-input">Symptoms</label>
        <input
          id="symptom-input"
          type="text"
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
                className={`suggestion ${suggestion.type === 'combination' ? 'combination-suggestion' : ''}`}
                onClick={() => handleSymptomSelect(suggestion)}
                role="option"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSymptomSelect(suggestion)}
              >
                <span className={`suggestion-text ${suggestion.type === 'combination' ? 'combination-text' : ''}`}>
                  {suggestion.type === 'combination' && <Link size={14} style={{ marginRight: '4px' }} />}
                  {suggestion.text}
                </span>
                <Plus size={16} className="add-icon" />
              </div>
            ))}
          </div>
        )}
        {selectedSymptoms.length > 0 && (
          <div className="selected-container">
            {selectedSymptoms.map((symptom) => (
              <div key={symptom} className="selected-symptom">
                <span>{symptom}</span>
                <span
                  className="delete-icon"
                  onClick={() => removeSymptom(symptom)}
                  role="button"
                  aria-label={`Remove ${symptom}`}
                >
                  <X size={16} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="row-container">
        <div className="input-group duration-input">
          <label htmlFor="duration-input">Duration</label>
          <input
            id="duration-input"
            type="number"
            value={patientInfo.duration}
            onChange={(e) => onPatientInfoChange('duration', e.target.value)}
            placeholder="Enter number"
          />
        </div>
        <div className="input-group duration-unit">
          <CustomSelect
            label="Duration Unit"
            value={patientInfo.durationUnit}
            options={['Days', 'Weeks', 'Months']}
            onSelect={(value) => onPatientInfoChange('durationUnit', value)}
            placeholder="Unit"
          />
        </div>
      </div>

      <CustomSelect
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