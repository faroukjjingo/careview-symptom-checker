import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { symptomList } from './SymptomList';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  InputAdornment,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';
import { symptomCombinations } from './SymptomCombinations';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-root': {
    borderRadius: 8,
  },
}));

const SuggestionsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1000,
  width: '100%',
  maxHeight: 300,
  overflowY: 'auto',
  borderRadius: 8,
  boxShadow: theme.shadows[3],
}));

const SelectedSymptomChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 16,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const CustomSelect = ({ label, value, options, onSelect, placeholder }) => {
  return (
    <StyledFormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onSelect(e.target.value)}
        label={label}
        displayEmpty
        renderValue={(selected) => (selected ? selected : <em>{placeholder}</em>)}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
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
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
      <StyledTextField
        fullWidth
        label="Age"
        type="number"
        value={patientInfo.age}
        onChange={(e) => onPatientInfoChange('age', e.target.value)}
        placeholder="Enter your age"
      />

      <CustomSelect
        label="Gender"
        value={patientInfo.gender}
        options={['Male', 'Female', 'Other']}
        onSelect={(value) => onPatientInfoChange('gender', value)}
        placeholder="Select your gender"
      />

      <Box sx={{ position: 'relative', marginBottom: 2 }}>
        <StyledTextField
          fullWidth
          label="Symptoms"
          placeholder="Type to search symptoms..."
          value={input}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Plus size={16} />
              </InputAdornment>
            ),
          }}
        />
        {suggestions.length > 0 && (
          <SuggestionsContainer>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSymptomSelect(suggestion)}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  padding: 1,
                }}
              >
                {suggestion.type === 'combination' && (
                  <ListItemIcon>
                    <LinkIcon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText primary={suggestion.text} />
              </ListItem>
            ))}
          </SuggestionsContainer>
        )}
        {selectedSymptoms.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {selectedSymptoms.map((symptom) => (
              <SelectedSymptomChip
                key={symptom}
                label={symptom}
                onDelete={() => removeSymptom(symptom)}
                deleteIcon={<X size={16} />}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <StyledTextField
          fullWidth
          label="Duration"
          type="number"
          value={patientInfo.duration}
          onChange={(e) => onPatientInfoChange('duration', e.target.value)}
          placeholder="Enter number"
        />
        <CustomSelect
          label="Duration Unit"
          value={patientInfo.durationUnit}
          options={['Days', 'Weeks', 'Months']}
          onSelect={(value) => onPatientInfoChange('durationUnit', value)}
          placeholder="Unit"
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