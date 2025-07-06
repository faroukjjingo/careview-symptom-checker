import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Send, Bot } from 'lucide-react';
import { symptomList } from './SymptomList';
import { symptomCombinations } from './SymptomCombinations';
import { travelRiskFactors } from './TravelRiskFactors';
import { riskFactorWeights } from './RiskFactorWeights';
import drugHistoryWeights from './DrugHistoryWeights';
import calculateDiagnosis from './SymptomCalculations';

const SymptomInput = ({ selectedSymptoms, setSelectedSymptoms, patientInfo, setPatientInfo, onDiagnosisResults }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm CareView, your friendly symptom checker. I'm here to guide you through understanding your symptoms. Type 'start' to begin or 'help' for more info.", isUser: false, isTyping: false },
  ]);
  const [typingMessage, setTypingMessage] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const steps = {
    welcome: { next: 'age', validate: () => true, error: '' },
    age: { next: 'gender', validate: () => patientInfo.age && !isNaN(parseInt(patientInfo.age)) && parseInt(patientInfo.age) > 0 && parseInt(patientInfo.age) <= 120, error: 'Please enter a valid age (e.g., 25, must be between 1 and 120).' },
    gender: { next: 'symptoms', validate: () => patientInfo.gender, error: 'Please select a valid gender.' },
    symptoms: { next: 'duration', validate: () => selectedSymptoms.length >= 2, error: 'Please select at least two symptoms to proceed.' },
    duration: { next: 'durationUnit', validate: () => patientInfo.duration && !isNaN(parseInt(patientInfo.duration)) && parseInt(patientInfo.duration) > 0 && parseInt(patientInfo.duration) <= 1000, error: 'Please enter a valid duration (e.g., 3, must be between 1 and 1000).' },
    durationUnit: { next: 'severity', validate: () => patientInfo.durationUnit, error: 'Please select a duration unit (Days, Weeks, or Months).' },
    severity: { next: 'travelRegion', validate: () => patientInfo.severity, error: 'Please select a severity level.' },
    travelRegion: { next: 'riskFactors', validate: () => patientInfo.travelRegion, error: 'Please select a travel region or "None".' },
    riskFactors: { next: 'drugHistory', validate: () => true, error: '' },
    drugHistory: { next: 'submit', validate: () => patientInfo.drugHistory, error: 'Please select a drug history option.' },
    submit: { next: null, validate: () => true, error: '' },
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    if (currentStep === 'submit') {
      handleSubmit();
    }
  }, [currentStep]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.isTyping && typingMessage) {
      if (typingIndex < typingMessage.length) {
        const timer = setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = typingMessage.slice(0, typingIndex + 1);
            return updated;
          });
          setTypingIndex((prev) => prev + 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].isTyping = false;
          return updated;
        });
        setTypingMessage('');
        setTypingIndex(0);
      }
    }
  }, [typingIndex, typingMessage, messages]);

  const addBotMessage = (text) => {
    setTypingMessage(text);
    setTypingIndex(0);
    setMessages((prev) => [...prev, { text: '', isUser: false, isTyping: true }]);
  };

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
        travelRegion: [...Object.keys(travelRiskFactors), 'None'],
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
      ]);
      addBotMessage(`Got it! Any more symptoms? (You need at least two. Type "done" when ready.)`);
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
    ]);
    addBotMessage(`Any more symptoms to add or remove? (Type "done" when ready.)`);
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
    setError('');
    setMessages((prev) => [
      ...prev,
      { text: `${field.charAt(0).toUpperCase() + field.slice(1)}: ${Array.isArray(value) ? value.join(', ') || 'None' : value}`, isUser: true },
    ]);
    if (steps[field].validate({ ...patientInfo, [field]: value })) {
      setCurrentStep(steps[field].next);
      addBotMessage(getNextPrompt(steps[field].next));
    } else {
      setError(steps[field].error);
      addBotMessage(steps[field].error);
    }
    setInput('');
    setSuggestions([]);
  };

  const getNextPrompt = (step) => {
    switch (step) {
      case 'age':
        return "Let's start with your age. How old are you? (Enter a number between 1 and 120)";
      case 'gender':
        return "What is your gender? Please select or type: Male, Female, or Other.";
      case 'symptoms':
        return "Now, tell me about your symptoms. Type to search and select at least two. When you're done, type 'done'.";
      case 'duration':
        return "How long have you been experiencing these symptoms? (Enter a number, e.g., 3)";
      case 'durationUnit':
        return "Is that in Days, Weeks, or Months? Please select or type one.";
      case 'severity':
        return "How severe are your symptoms? Please select or type: Mild, Moderate, or Severe.";
      case 'travelRegion':
        return "Have you traveled recently? Select a region or 'None' if you haven't.";
      case 'riskFactors':
        return "Any risk factors to note? Select any that apply or type 'none' to skip.";
      case 'drugHistory':
        return "What about your medication history? Please select or type an option.";
      case 'submit':
        return "All set! I'm analyzing your information now...";
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
      parseInt(patientInfo.age),
      patientInfo.gender,
      patientInfo.drugHistory,
      patientInfo.travelRegion,
      patientInfo.riskFactors
    );
    onDiagnosisResults(result);
    addBotMessage("I've got your results! Scroll down to see the possible diagnoses.");
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!input.trim()) return;

      setMessages((prev) => [
        ...prev,
        { text: input, isUser: true },
      ]);

      const inputLower = input.toLowerCase().trim();

      if (currentStep === 'welcome') {
        if (inputLower === 'start') {
          setCurrentStep('age');
          addBotMessage(getNextPrompt('age'));
        } else if (inputLower === 'help') {
          addBotMessage("I'm CareView, here to help you understand your symptoms. I'll guide you step-by-step to enter your details. Type 'start' to begin, use the dropdowns to select options, or type your answers. You can type 'done' for symptoms or 'none' for optional fields like risk factors or travel.");
        } else {
          addBotMessage("Hmm, please type 'start' to begin or 'help' for more info.");
        }
        setInput('');
      } else if (currentStep === 'symptoms') {
        if (inputLower === 'done') {
          if (selectedSymptoms.length < 2) {
            setError('Please select at least two symptoms.');
            addBotMessage('You need at least two symptoms to proceed. Please add more or select from the list.');
          } else {
            setCurrentStep(steps[currentStep].next);
            addBotMessage(getNextPrompt(steps[currentStep].next));
            setInput('');
          }
        } else if (suggestions.length > 0) {
          handleSymptomSelect(suggestions[0]);
        } else {
          setError('Please select a valid symptom from the list.');
          addBotMessage('That symptom isn\'t in our list. Please select one from the suggestions.');
          setInput('');
        }
      } else if (currentStep === 'riskFactors' && inputLower === 'none') {
        handlePatientInfoChange('riskFactors', []);
      } else if (currentStep === 'travelRegion' && inputLower === 'none') {
        handlePatientInfoChange('travelRegion', 'None');
      } else if (['age', 'duration'].includes(currentStep)) {
        const num = parseInt(input);
        if (input && !isNaN(num) && num > 0 && (currentStep === 'age' ? num <= 120 : num <= 1000)) {
          handlePatientInfoChange(currentStep, input);
        } else {
          setError(steps[currentStep].error);
          addBotMessage(steps[currentStep].error);
          setInput('');
        }
      } else if (['gender', 'durationUnit', 'severity', 'travelRegion', 'drugHistory'].includes(currentStep)) {
        const options = {
          gender: ['Male', 'Female', 'Other'],
          durationUnit: ['Days', 'Weeks', 'Months'],
          severity: ['Mild', 'Moderate', 'Severe'],
          travelRegion: [...Object.keys(travelRiskFactors), 'None'],
          drugHistory: Object.keys(drugHistoryWeights),
        }[currentStep];
        const matchedOption = options.find((opt) =>
          opt.toLowerCase() === inputLower
        );
        if (matchedOption) {
          handlePatientInfoChange(currentStep, matchedOption);
        } else if (suggestions.length > 0) {
          handlePatientInfoChange(currentStep, suggestions[0].text);
        } else {
          setError(`Please select a valid ${currentStep} from the suggestions or type a matching value.`);
          addBotMessage(`That's not a valid ${currentStep}. Please select from the suggestions or type a matching value.`);
          setInput('');
        }
      }
    }
  };

  const handleSelectSubmit = (field, value) => {
    handlePatientInfoChange(field, value);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-card px-2 sm:px-4 py-2">
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 bg-background border border-border rounded-lg mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`flex items-start gap-2 max-w-[85%] p-2 rounded-lg ${
                msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              } ${msg.isTyping ? 'skeleton' : ''}`}
            >
              {!msg.isUser && <Bot size={16} className="mt-1" />}
              <span className={`text-sm ${msg.isTyping ? 'text-foreground/20' : ''}`}>{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <p className="text-destructive mb-2 text-center text-sm">{error}</p>
      )}

      {['gender', 'durationUnit', 'severity', 'travelRegion', 'drugHistory', 'riskFactors'].includes(currentStep) && (
        <div className="mb-2">
          {currentStep === 'gender' && (
            <select
              value={patientInfo.gender}
              onChange={(e) => handleSelectSubmit('gender', e.target.value)}
              className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
              className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
              className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
              className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="" disabled>Select travel region</option>
              {[...Object.keys(travelRiskFactors), 'None'].map((option) => (
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
                className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 h-20 transition-all"
              >
                {Object.keys(riskFactorWeights).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button
                onClick={() => handlePatientInfoChange('riskFactors', [])}
                className="mt-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 w-full transition-all text-sm"
              >
                Skip (No Risk Factors)
              </button>
            </div>
          )}
          {currentStep === 'drugHistory' && (
            <select
              value={patientInfo.drugHistory}
              onChange={(e) => handleSelectSubmit('drugHistory', e.target.value)}
              className="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedSymptoms.map((symptom) => (
            <div
              key={symptom}
              className="flex items-center px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs"
            >
              {symptom}
              <X
                size={14}
                className="ml-1 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => removeSymptom(symptom)}
              />
            </div>
          ))}
        </div>
      )}

      {currentStep !== 'submit' && (
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleInputSubmit}
              placeholder={
                currentStep === 'symptoms'
                  ? 'Type symptoms or "done"'
                  : currentStep === 'riskFactors'
                  ? 'Type "none" or select from list'
                  : currentStep === 'travelRegion'
                  ? 'Type region or "none"'
                  : currentStep === 'welcome'
                  ? 'Type "start" or "help"'
                  : `Enter ${currentStep}`
              }
              className="w-full p-2 pr-8 border border-input rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={currentStep === 'submit'}
            />
            {currentStep === 'symptoms' && (
              <Plus size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary" />
            )}
          </div>
          <button
            onClick={handleInputSubmit}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
            disabled={currentStep === 'submit' || !input.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute w-full max-w-full max-h-40 overflow-y-auto bg-popover border border-border rounded-lg shadow-lg mt-1 z-10 left-0 right-0 mx-2 sm:mx-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center p-2 cursor-pointer hover:bg-muted transition-colors suggestion-highlight"
              onClick={() => (currentStep === 'symptoms' ? handleSymptomSelect(suggestion) : handlePatientInfoChange(currentStep, suggestion.text))}
            >
              <span className={`text-sm ${suggestion.type === 'combination' ? 'italic text-muted-foreground' : 'text-foreground'}`}>{suggestion.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymptomInput;