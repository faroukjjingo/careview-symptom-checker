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
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';
import { symptomCombinations } from './SymptomCombinations';
import calculateDiagnosis from './calculateDiagnosis';

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

const CustomSelect = ({ label, value, options, onSelect, placeholder, required }) => {
  return (
    <StyledFormControl required={required}>
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
    // Validate all fields
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
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <StyledTextField
        fullWidth
        label="Age"
        type="number"
        value={patientInfo.age}
        onChange={(e) => handlePatientInfoChange('age', e.target.value)}
        placeholder="Enter age"
        required
      />

      <CustomSelect
        label="Gender"
        value={patientInfo.gender}
        options={['Male', 'Female', 'Other']}
        onSelect={(value) => handlePatientInfoChange('gender', value)}
        placeholder="Select gender"
        required
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
          required
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
          onChange={(e) => handlePatientInfoChange('duration', e.target.value)}
          placeholder="Enter number"
          required
        />
        <CustomSelect
          label="Duration Unit"
          value={patientInfo.durationUnit}
          options={['Days', 'Weeks', 'Months']}
          onSelect={(value) => handlePatientInfoChange('durationUnit', value)}
          placeholder="Unit"
          required
        />
      </Box>

      <CustomSelect
        label="Severity"
        value={patientInfo.severity}
        options={['Mild', 'Moderate', 'Severe']}
        onSelect={(value) => handlePatientInfoChange('severity', value)}
        placeholder="Select severity"
        required
      />

      <CustomSelect
        label="Travel Region"
        value={patientInfo.travelRegion}
        options={Object.keys(travelRiskFactors)}
        onSelect={(value) => handlePatientInfoChange('travelRegion', value)}
        placeholder="Select travel region"
        required
      />

      <CustomSelect
        label="Risk Factors"
        value={patientInfo.riskFactors}
        options={Object.keys(riskFactorWeights)}
        onSelect={(value) =>
          handlePatientInfoChange('riskFactors', [
            ...patientInfo.riskFactors,
            value,
          ])
        }
        placeholder="Select risk factors"
        multiple
      />

      <CustomSelect
        label="Drug History"
        value={patientInfo.drugHistory}
        options={Object.keys(drugHistoryWeights)}
        onSelect={(value) => handlePatientInfoChange('drugHistory', value)}
        placeholder="Select drug history"
        required
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Get Diagnosis
      </Button>
    </Box>
  );
};

export default SymptomInput;