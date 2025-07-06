import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Link, Send } from 'lucide-react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import { travelRiskFactors } from './TravelRiskFactors';
import { riskFactorWeights } from './RiskFactorWeights';
import { drugHistoryWeights } from './DrugHistoryWeights';
import calculateDiagnosis from './SymptomCalculations';

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

    if (currentStep === 'symptoms') {
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
    } else if (['gender', 'durationUnit', 'severity', 'travelRegion', 'drugHistory'].includes(currentStep)) {
      const options = {
        gender: ['Male', 'Female', 'Other'],
        durationUnit: ['Days', 'Weeks', 'Months'],
        severity: ['Mild', 'Moderate', 'Severe'],
        travelRegion: Object.keys(travelRiskFactors),
        drugHistory: Object.keys(drugHistoryWeights),
      }[currentStep];
      const filteredOptions = options
        .filter((option) => option.toLowerCase().includes(text.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filteredOptions.map((option) => ({ type: 'single', text: option })));
    } else {
      setSuggestions([]);
    }
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
        return 'What is your gender? (Type or select: Male, Female, Other)';
      case 'symptoms':
        return 'Please tell me your symptoms. Type to search, select at least two, and type "done" when ready.';
      case 'duration':
        return 'How long have you had these symptoms? Enter a number.';
      case 'durationUnit':
        return 'What is the unit of duration? (Type or select: Days, Weeks, Months)';
      case 'severity':
        return 'How severe are your symptoms? (Type or select: Mild, Moderate, Severe)';
      case 'travelRegion':
        return 'Have you recently traveled to any specific region? (Type or select a region)';
      case 'riskFactors':
        return 'Do you have any risk factors? Type "none" to skip, or select from the list.';
      case 'drugHistory':
        return 'What is your drug history? (Type or select an option)';
      case 'submit':
        return 'Ready to get your diagnosis. Please type "submit" to confirm.';
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
        setInput('');
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
      } else if (['gender', 'durationUnit', 'severity', 'travelRegion', 'drugHistory'].includes(currentStep)) {
        if (input) {
          const options = {
            gender: ['Male', 'Female', 'Other'],
            durationUnit: ['Days', 'Weeks', 'Months'],
            severity: ['Mild', 'Moderate', 'Severe'],
            travelRegion: Object.keys(travelRiskFactors),
            drugHistory: Object.keys(drugHistoryWeights),
          }[currentStep];
          const matchedOption = options.find((opt) =>
            opt.toLowerCase().includes(input.toLowerCase())
          );
          if (matchedOption) {
            handlePatientInfoChange(currentStep, matchedOption);
            setInput('');
          } else {
            setError(`Please select a valid ${currentStep} from the list or type a matching value.`);
            setMessages((prev) => [
              ...prev,
              { text: `Please select a valid ${currentStep}.`, isUser: false },
            ]);
          }
        }
      }
    }
  };

  const handleSelectSubmit = (field, value) => {
    handlePatientInfoChange(field, value);
  };

  return (
    <div className="max-w-xl mx-auto p-4 h-[70vh] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 bg-background border border-border rounded-[var(--radius)] mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-[var(--radius)] ${
                msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <p className="text-destructive mb-4 text-center">{error}</p>
      )}

      {['gender', 'durationUnit', 'severity', 'travelRegion', 'drugHistory', 'riskFactors'].includes(currentStep) && (
        <div className="mb-4">
          {currentStep === 'gender' && (
            <select
              value={patientInfo.gender}
              onChange={(e) => handleSelectSubmit('gender', e.target.value)}
              className="w-full p-2 border border-input rounded-[var(--radius)] bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              required
            >
              <option value="" disabled>Select gender</option>
              {['Male', 'Female', 'Other'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
          {currentStep === 'durationUnit' && (
            <select
              value={patientInfo.durationUnit}
              onChange={(e) => handleSelectSubmit('durationUnit', e.target.value)}
              className="w-full p-2 border border-input rounded-[var(--radius)] bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              required
            >
              <option value="" disabled>Select unit</option>
              {['Days', 'Weeks', 'Months'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
          {currentStep === 'severity' && (
            <select
              value={patientInfo.severity}
              onChange={(e) => handleSelectSubmit('severity', e.target.value)}
              className="w-full p-2 border border-input rounded-[var(--radius)] bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              required
            >
              <option value="" disabled>Select severity</option>
              {['Mild', 'Moderate', 'Severe'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
          {currentStep === 'travelRegion' && (
            <select
              value={patientInfo.travelRegion}
              onChange={(e) => handleSelectSubmit('travelRegion', e.target.value)}
              className="w-full p-2 border border-input rounded-[var(--radius)] bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              required
            >
              <option value="" disabled>Select travel region</option>
              {Object.keys(travelRiskFactors).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
          {currentStep === 'riskFactors' && (
            <div>
              <select
                multiple
                value={patientInfo.riskFactors}
                onChange={(e) => handleSelectSubmit('riskFactors', Array.from(e.target.selectedOptions, (option) => option.value))}
                className="w-full p-2 border border-input rounded-[var(--radius)] bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary h-24"
              >
                {Object.keys(riskFactorWeights).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  setMessages((prev) => [
                    ...prev,
                    { text: 'None', isUser: true },
                    { text: getNextPrompt(steps[currentStep].next), isUser: false },
                  ]);
                  setPatientInfo((prev) => ({ ...prev, riskFactors: [] }));
                  setCurrentStep(steps[currentStep].next);
                }}
                className="mt-2 p-2 bg-primary text-primary-foreground rounded-[var(--radius)] hover:bg-primary/90"
              >
                Skip (No Risk Factors)
              </button>
            </div>
          )}
          {currentStep === 'drugHistory' && (
            <select
              value={patientInfo.drugHistory}
              onChange={(e) => handleSelectSubmit('drugHistory', e.target.value)}
              className="w-full p-2 border border-input rounded-[var(--radius)] bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              required
            >
              <option value="" disabled>Select drug history</option>
              {Object.keys(drugHistoryWeights).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {currentStep === 'symptoms' && selectedSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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

      {currentStep !== 'welcome' && (
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleInputSubmit}
              placeholder={
                currentStep === 'symptoms'
                  ? 'Type symptoms or "done"'
                  : currentStep === 'submit'
                  ? 'Type "submit"'
                  : currentStep === 'riskFactors'
                  ? 'Type "none" or select from list'
                  : `Enter ${currentStep}`
              }
              className="w-full p-2 pr-10 border border-input rounded-[var(--radius)] bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              required={currentStep !== 'riskFactors'}
            />
            {currentStep === 'symptoms' && (
              <Plus size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary" />
            )}
          </div>
          <button
            onClick={handleInputSubmit}
            className="p-2 bg-primary text-primary-foreground rounded-[var(--radius)] hover:bg-primary/90"
          >
            <Send size={16} />
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute w-full max-h-60 overflow-y-auto bg-popover border border-border rounded-[var(--radius)] shadow-md mt-1 z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center p-2 cursor-pointer hover:bg-muted suggestion-highlight"
              onClick={() => (currentStep === 'symptoms' ? handleSymptomSelect(suggestion) : handlePatientInfoChange(currentStep, suggestion.text))}
            >
              {suggestion.type === 'combination' && (
                <Link size={16} className="mr-2 text-primary" />
              )}
              <span className={suggestion.type === 'combination' ? 'italic' : ''}>{suggestion.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymptomInput;