import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Chip, Box, Typography, Paper } from '@material-ui/core';
import { Plus, X, ChevronDown, ChevronUp, Link } from 'lucide-react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';


const CustomSelect = ({ label, value, options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormControl fullWidth className="input-group">
      <InputLabel>{label}</InputLabel>
      <Box className="select-button" onClick={() => setIsOpen(!isOpen)} role="combobox" aria-expanded={isOpen}>
        <Typography className={value ? 'select-text' : 'placeholder-text'}>{value || placeholder}</Typography>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Box>
      {isOpen && (
        <Paper className="options-container">
          {options.map((option) => (
            <MenuItem
              key={option}
              className={value === option ? 'selected-option' : ''}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option}
            >
              <Typography className={value === option ? 'selected-option-text' : ''}>{option}</Typography>
              {value === option && <span className="check-icon">✓</span>}
            </MenuItem>
          ))}
        </Paper>
      )}
    </FormControl>
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
    <Box className="symptom-input-container">
      <TextField
        fullWidth
        label="Age"
        type="number"
        value={patientInfo.age}
        onChange={(e) => onPatientInfoChange('age', e.target.value)}
        placeholder="Enter your age"
        className="input-group"
      />

      <CustomSelect
        label="Gender"
        value={patientInfo.gender}
        options={['Male', 'Female', 'Other']}
        onSelect={(value) => onPatientInfoChange('gender', value)}
        placeholder="Select your gender"
      />

      <Box className="input-group">
        <TextField
          fullWidth
          label="Symptoms"
          placeholder="Type to search symptoms..."
          value={input}
          onChange={handleInputChange}
          aria-autocomplete="list"
          aria-controls="suggestions-container"
        />
        {suggestions.length > 0 && (
          <Paper className="suggestions-container" id="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <Box
                key={index}
                className={`suggestion ${suggestion.type === 'combination' ? 'combination-suggestion' : ''}`}
                onClick={() => handleSymptomSelect(suggestion)}
                role="option"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSymptomSelect(suggestion)}
              >
                <Typography className={`suggestion-text ${suggestion.type === 'combination' ? 'combination-text' : ''}`}>
                  {suggestion.type === 'combination' && <Link size={14} style={{ marginRight: 4 }} />}
                  {suggestion.text}
                </Typography>
                <Plus size={16} className="add-icon" />
              </Box>
            ))}
          </Paper>
        )}
        {selectedSymptoms.length > 0 && (
          <Box className="selected-container">
            {selectedSymptoms.map((symptom) => (
              <Chip
                key={symptom}
                label={symptom}
                onDelete={() => removeSymptom(symptom)}
                className="selected-symptom"
                deleteIcon={<X size={16} />}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box className="row-container">
        <TextField
          label="Duration"
          type="number"
          value={patientInfo.duration}
          onChange={(e) => onPatientInfoChange('duration', e.target.value)}
          placeholder="Enter number"
          className="duration-input"
        />
        <CustomSelect
          label="Duration Unit"
          value={patientInfo.durationUnit}
          options={['Days', 'Weeks', 'Months']}
          onSelect={(value) => onPatientInfoChange('durationUnit', value)}
          placeholder="Unit"
          className="duration-unit"
        />
      </Box>

      <CustomSelect
        label="Severity"
        value={patientInfo.severity}
        options={['Mild', 'Moderate', 'Severe']}
        onSelect={(value) => onPatientInfoChange('severity', value)}
        placeholder="Select severity level"
      />
    </Box>
  );
};

export default SymptomInput;