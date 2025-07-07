import { useState, useContext, useEffect } from 'react';
import { SymptomCheckerContext } from '../context/SymptomCheckerContext';
import { symptomList, symptomCombinations } from '../data/SymptomData';
import { drugOptions } from '../data/DrugOptions';
import { steps } from '../data/Steps';
import BotMessages from '../utils/BotMessages';
import useInputContext from './useInputContext';

const useSymptomInput = () => {
  const { currentStep, patientInfo, setMessages, setCurrentStep, handlePatientInfoChange, startTyping } = useContext(SymptomCheckerContext);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [drugSuggestions, setDrugSuggestions] = useState([]);
  const { processInput } = useInputContext();

  useEffect(() => {
    if (currentStep === 'symptoms' && input.trim()) {
      const availableSymptoms = Array.isArray(symptomList) ? symptomList : Object.keys(symptomList);
      const filteredSymptoms = availableSymptoms
        .filter(
          (symptom) =>
            symptom.toLowerCase().includes(input.toLowerCase()) &&
            !patientInfo.symptoms.includes(symptom)
        )
        .slice(0, 5);

      const filteredCombinations = Object.keys(symptomCombinations)
        .filter((combination) =>
          combination.toLowerCase().includes(input.toLowerCase())
        )
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
      setDrugSuggestions([]);
    } else if (currentStep === 'drugHistory' && input.trim()) {
      const filteredDrugs = drugOptions
        .filter(
          (drug) =>
            drug.toLowerCase().includes(input.toLowerCase()) &&
            !patientInfo.drugHistory.includes(drug)
        )
        .slice(0, 5);
      setDrugSuggestions(filteredDrugs);
      setSuggestions([]);
    } else {
      setSuggestions([]);
      setDrugSuggestions([]);
    }
  }, [input, currentStep, patientInfo.symptoms, patientInfo.drugHistory]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSymptomSelect = (suggestion) => {
    const symptomsToAdd = suggestion.type === 'combination' ? suggestion.symptoms : [suggestion.text];
    const uniqueNewSymptoms = symptomsToAdd.filter((symptom) => !patientInfo.symptoms.includes(symptom));
    if (uniqueNewSymptoms.length > 0) {
      const updatedSymptoms = [...patientInfo.symptoms, ...uniqueNewSymptoms];
      handlePatientInfoChange('symptoms', updatedSymptoms);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Added: ${uniqueNewSymptoms.join(', ')}`, isTyping: false },
      ]);
      startTyping(BotMessages.getSymptomPrompt());
    }
    setInput('');
    setSuggestions([]);
  };

  const handleDrugSelect = (drug) => {
    const currentDrugs = patientInfo.drugHistory || [];
    if (!currentDrugs.includes(drug)) {
      const updatedDrugs = [...currentDrugs, drug];
      handlePatientInfoChange('drugHistory', updatedDrugs);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Added drug: ${drug}`, isTyping: false },
      ]);
      startTyping(BotMessages.getStepPrompt('drugHistory'));
    }
    setInput('');
    setDrugSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input, isTyping: false }]);

    const result = processInput(input, currentStep, patientInfo, suggestions, drugSuggestions);
    if (result.isValid) {
      handlePatientInfoChange(currentStep, result.value);
      const stepIndex = steps.findIndex((s) => s.name === currentStep);
      const nextStep = steps[stepIndex + 1]?.name;
      if (nextStep) {
        setCurrentStep(nextStep);
        startTyping(BotMessages.getStepPrompt(nextStep));
      }
    } else {
      startTyping(result.response);
    }
    setInput('');
  };

  return {
    input,
    setInput,
    suggestions,
    drugSuggestions,
    handleInputChange,
    handleSymptomSelect,
    handleDrugSelect,
    handleSubmit,
  };
};

export default useSymptomInput;