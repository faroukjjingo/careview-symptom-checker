import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Link } from 'lucide-react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import { travelRiskFactors } from './TravelRiskFactors';
import { riskFactorWeights } from './RiskFactorWeights';
import drugHistoryWeights from './DrugHistoryWeights';
import calculateDiagnosis from './SymptomCalculations';
import {
  Box,
  TextField,
  Select,
  MenuItem,
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
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  padding: theme.spacing(2),
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius)',
  marginBottom: theme.spacing(2),
}));

const Message = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2),
  '& > div': {
    maxWidth: '70%',
    padding: theme.spacing(1.5),
    borderRadius: 'var(--radius)',
    backgroundColor: isUser ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
    color: isUser ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: 'var(--radius)',
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--foreground))',
  },
  '& .MuiInputLabel-root': {
    color: 'hsl(var(--muted-foreground))',
  },
  '& .MuiInputBase-root:hover': {
    borderColor: 'hsl(var(--primary))',
  },
  '& .Mui-focused': {
    borderColor: 'hsl(var(--primary))',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  '& .MuiInputBase-root': {
    borderRadius: 'var(--radius)',
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--foreground))',
  },
  '& .MuiInputLabel-root': {
    color: 'hsl(var(--muted-foreground))',
  },
  '& .MuiInputBase-root:hover': {
    borderColor: 'hsl(var(--primary))',
  },
  '& .Mui-focused': {
    borderColor: 'hsl(var(--primary))',
  },
}));

const SuggestionsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1000,
  width: '100%',
  maxHeight: 300,
  overflowY: 'auto',
  borderRadius: 'var(--radius)',
  backgroundColor: 'hsl(var(--popover))',
  color: 'hsl(var(--popover-foreground))',
  boxShadow: '0 4px 12px hsl(var(--muted)/0.2)',
}));

const SelectedSymptomChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 16,
  backgroundColor: 'hsl(var(--primary))',
  color: 'hsl(var(--primary-foreground))',
}));

const CustomSelect = ({ label, value, options, onSelect, placeholder, required, multiple }) => {
  return (
    <StyledFormControl required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || (multiple ? [] : '')}
        onChange={(e) => onSelect(multiple ? Array.from(e.target.value) : e.target.value)}
        label={label}
        displayEmpty
        multiple={multiple}
        renderValue={(selected) =>
          selected.length === 0 || !selected
            ? <em className="text-muted-foreground">{placeholder}</em>
            : multiple
            ? selected.join(', ')
            : selected
        }
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
  const [currentStep, setCurrentStep] = useState('welcome');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help you explore possible diagnoses. Let's start with your age. How old are you?", isUser: false },
  ]);
  const chatEndRef = useRef(null);

  const steps = {
    welcome: { next: 'age' },
    age: { next: 'gender', validate: () => patientInfo.age && !isNaN(parseInt(patientInfo.age)), error: 'Please enter a valid age.' },
    gender: { next: 'symptoms', validate: () => patientInfo.gender, error: 'Please select a gender.' },
    symptoms: { next: 'duration', validate: () => selectedSymptoms.length >= 2, error: 'Please select at least two symptoms.' },
    duration: { next: 'durationUnit', validate: () => patientInfo.duration && !isNaN(parseInt(patientInfo.duration)), error: 'Please enter a valid duration.' },
    durationUnit: { next: 'severity', validate: () => patientInfo.durationUnit, error: 'Please select a duration unit.' },
    severity: { next: 'travelRegion', validate: () => patientInfo.severity, error: 'Please select a severity.' },
    travelRegion: { next: 'riskFactors', validate: () => patientInfo.travelRegion, error: 'Please select a travel region.' },
    riskFactors: { next: 'drugHistory', validate: () => true, error: '' },
    drugHistory: { next: 'submit', validate: () => patientInfo.drugHistory, error: 'Please select a drug history.' },
    submit: { next: null },
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInput(text);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const availableSymptoms = Array.isArray(symptomList) ? symptomList : Object.keys(symptomList);
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
      setMessages((prev) => [
        ...prev,
        { text: `Added: ${uniqueNewSymptoms.join(', ')}`, isUser: true },
        { text: `Got it! Any more symptoms? (Select at least two total, or type "done" to proceed)`, isUser: false },
      ]);
      setError('');
    }

    setInput('');
    setSuggestions([]);
  };

  const removeSymptom = (symptomToRemove) => {
    const updatedSymptoms = selectedSymptoms.filter((s) => s !== symptomToRemove);
    setSelectedSymptoms(updatedSymptoms);
    setMessages((prev) => [
      ...prev,
      { text: `Removed: ${symptomToRemove}`, isUser: true },
      { text: `Any more symptoms to add or remove? (Type "done" when ready)`, isUser: false },
    ]);
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    setError('');
    if (field === 'riskFactors') {
      setMessages((prev) => [
        ...prev,
        { text: value.length > 0 ? `Selected: ${value.join(', ')}` : 'No risk factors selected', isUser: true },
        { text: steps[currentStep].next === 'drugHistory' ? 'What is your drug history?' : 'Proceeding...', isUser: false },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: `${field.charAt(0).toUpperCase() + field.slice(1)}: ${value}`, isUser: true },
        { text: getNextPrompt(steps[currentStep].next), isUser: false },
      ]);
    }
    if (steps[currentStep].validate()) {
      setCurrentStep(steps[currentStep].next);
    } else {
      setError(steps[currentStep].error);
    }
  };

  const getNextPrompt = (step) => {
    switch (step) {
      case 'age':
        return 'How old are you?';
      case 'gender':
        return 'What is your gender?';
      case 'symptoms':
        return 'Please tell me your symptoms. Type to search, select at least two, and type "done" when ready.';
      case 'duration':
        return 'How long have you had these symptoms? Enter a number.';
      case 'durationUnit':
        return 'What is the unit of duration (Days, Weeks, Months)?';
      case 'severity':
        return 'How severe are your symptoms?';
      case 'travelRegion':
        return 'Have you recently traveled to any specific region?';
      case 'riskFactors':
        return 'Do you have any risk factors? Select all that apply, or type "none" to skip.';
      case 'drugHistory':
        return 'What is your drug history?';
      case 'submit':
        return 'Ready to get your diagnosis. Please confirm by typing "submit".';
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
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
    setMessages((prev) => [
      ...prev,
      { text: 'Submitting for diagnosis...', isUser: true },
    ]);
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (currentStep === 'symptoms') {
        if (input.toLowerCase() === 'done') {
          if (selectedSymptoms.length < 2) {
            setError('Please select at least two symptoms.');
            setMessages((prev) => [
              ...prev,
              { text: 'Please select at least two symptoms before proceeding.', isUser: false },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { text: 'Done', isUser: true },
              { text: getNextPrompt(steps[currentStep].next), isUser: false },
            ]);
            setCurrentStep(steps[currentStep].next);
            setInput('');
          }
        } else if (suggestions.length > 0) {
          handleSymptomSelect(suggestions[0]);
        }
      } else if (currentStep === 'riskFactors' && input.toLowerCase() === 'none') {
        setMessages((prev) => [
          ...prev,
          { text: 'None', isUser: true },
          { text: getNextPrompt(steps[currentStep].next), isUser: false },
        ]);
        setPatientInfo((prev) => ({ ...prev, riskFactors: [] }));
        setCurrentStep(steps[currentStep].next);
        setInput('');
      } else if (currentStep === 'submit' && input.toLowerCase() === 'submit') {
        handleSubmit();
      } else if (['age', 'duration'].includes(currentStep)) {
        if (input && !isNaN(parseInt(input))) {
          handlePatientInfoChange(currentStep, input);
          setInput('');
        } else {
          setError(steps[currentStep].error);
          setMessages((prev) => [
            ...prev,
            { text: steps[currentStep].error, isUser: false },
          ]);
        }
      }
    }
  };

  return (
    <ChatContainer>
      <ChatMessages>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser}>
            <Box>
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          </Message>
        ))}
        <div ref={chatEndRef} />
      </ChatMessages>

      {error && (
        <Typography className="text-destructive mb-4 text-center">{error}</Typography>
      )}

      {currentStep === 'age' && (
        <StyledTextField
          fullWidth
          label="Age"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleInputSubmit}
          placeholder="Enter age"
          required
        />
      )}

      {currentStep === 'gender' && (
        <CustomSelect
          label="Gender"
          value={patientInfo.gender}
          options={['Male', 'Female', 'Other']}
          onSelect={(value) => handlePatientInfoChange('gender', value)}
          placeholder="Select gender"
          required
        />
      )}

      {currentStep === 'symptoms' && (
        <Box sx={{ position: 'relative' }}>
          <StyledTextField
            fullWidth
            label="Symptoms"
            placeholder="Type symptoms or 'done'"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleInputSubmit}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Plus size={16} className="text-primary" />
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
                  className="suggestion-highlight"
                  sx={{ '&:hover': { backgroundColor: 'hsl(var(--muted))' }, padding: 1 }}
                >
                  {suggestion.type === 'combination' && (
                    <ListItemIcon>
                      <Link size={16} className="text-primary" />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={suggestion.text}
                    primaryTypographyProps={{
                      className: suggestion.type === 'combination' ? 'italic' : '',
                    }}
                  />
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
                  deleteIcon={<X size={16} className="text-primary-foreground hover:text-destructive" />}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {currentStep === 'duration' && (
        <StyledTextField
          fullWidth
          label="Duration"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleInputSubmit}
          placeholder="Enter number"
          required
        />
      )}

      {currentStep === 'durationUnit' && (
        <CustomSelect
          label="Duration Unit"
          value={patientInfo.durationUnit}
          options={['Days', 'Weeks', 'Months']}
          onSelect={(value) => handlePatientInfoChange('durationUnit', value)}
          placeholder="Select unit"
          required
        />
      )}

      {currentStep === 'severity' && (
        <CustomSelect
          label="Severity"
          value={patientInfo.severity}
          options={['Mild', 'Moderate', 'Severe']}
          onSelect={(value) => handlePatientInfoChange('severity', value)}
          placeholder="Select severity"
          required
        />
      )}

      {currentStep === 'travelRegion' && (
        <CustomSelect
          label="Travel Region"
          value={patientInfo.travelRegion}
          options={Object.keys(travelRiskFactors)}
          onSelect={(value) => handlePatientInfoChange('travelRegion', value)}
          placeholder="Select travel region"
          required
        />
      )}

      {currentStep === 'riskFactors' && (
        <Box>
          <CustomSelect
            label="Risk Factors"
            value={patientInfo.riskFactors}
            options={Object.keys(riskFactorWeights)}
            onSelect={(value) => handlePatientInfoChange('riskFactors', value)}
            placeholder="Select risk factors"
            multiple
          />
          <Button
            onClick={() => {
              setMessages((prev) => [
                ...prev,
                { text: 'None', isUser: true },
                { text: getNextPrompt(steps[currentStep].next), isUser: false },
              ]);
              setPatientInfo((prev) => ({ ...prev, riskFactors: [] }));
              setCurrentStep(steps[currentStep].next);
            }}
            sx={{ mt: 1 }}
          >
            Skip (No Risk Factors)
          </Button>
        </Box>
      )}

      {currentStep === 'drugHistory' && (
        <CustomSelect
          label="Drug History"
          value={patientInfo.drugHistory}
          options={Object.keys(drugHistoryWeights)}
          onSelect={(value) => handlePatientInfoChange('drugHistory', value)}
          placeholder="Select drug history"
          required
        />
      )}

      {currentStep === 'submit' && (
        <StyledTextField
          fullWidth
          label="Confirm"
          placeholder="Type 'submit' to get diagnosis"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleInputSubmit}
          required
        />
      )}

      {(currentStep === 'symptoms' || currentStep === 'submit' || ['age', 'duration'].includes(currentStep)) && (
        <Button
          variant="contained"
          onClick={handleInputSubmit}
          sx={{
            mt: 2,
            borderRadius: 'var(--radius)',
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            '&:hover': { backgroundColor: 'hsl(var(--primary)/0.9)' },
          }}
        >
          Submit
        </Button>
      )}
    </ChatContainer>
  );
};

export default SymptomInput;