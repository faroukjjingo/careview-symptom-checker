import React, { useState, useEffect } from 'react';
import SymptomInput from './SymptomInput';
import calculateDiagnosis from './SymptomCalculations';
import CustomButton from './CustomButton';
import RiskTravelSelector from './RiskTravelSelector';
import { guidance } from './guidance';
import riskFactorWeights from './RiskFactorWeights';
import travelRiskFactors from './TravelRiskFactors';
import './Checker.css';

const capitalizeWords = (str) =>
  str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const LoadingBar = ({ progress }) => (
  <div className="loading-bar-container">
    <div className="loading-bar" style={{ width: `${progress}%` }}></div>
  </div>
);

const DiagnosisCard = ({ diagnosis, index, isExpanded, onToggle }) => {
  const [fadeAnim, setFadeAnim] = useState(0);
  const [slideAnim, setSlideAnim] = useState(50);

  useEffect(() => {
    setTimeout(() => {
      setFadeAnim(1);
      setSlideAnim(0);
    }, index * 200);
  }, [index]);

  const confidenceColor = {
    High: '#10b981',
    Medium: '#f59e0b',
    Low: '#ef4444',
  }[diagnosis.confidence] || '#6b7280';

  const guidanceContent = guidance[diagnosis.diagnosis]?.content;

  return (
    <div
      className="diagnosis-card"
      style={{ opacity: fadeAnim, transform: `translateY(${slideAnim}px)`, '--index': index }}
      role="region"
      aria-labelledby={`diagnosis-${index}`}
    >
      <div
        className="card-header"
        onClick={() => {
          navigator.vibrate?.(50);
          onToggle();
        }}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="ranking-badge">
          <span className="ranking-text">{index + 1}</span>
        </div>
        <div className="header-content">
          <h3 className="diagnosis-title" id={`diagnosis-${index}`}>
            {capitalizeWords(diagnosis.diagnosis)}
          </h3>
          <div className="confidence-badge" style={{ backgroundColor: `${confidenceColor}20` }}>
            <span className="confidence-text" style={{ color: confidenceColor }}>
              {diagnosis.confidence} • {diagnosis.probability}% Match
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="card-content">
          {guidanceContent && (
            <div className="guidance-section">
              <h4 className="section-title">Medical Guidance</h4>
              <p className="guidance-text">{guidanceContent}</p>
            </div>
          )}
          <div className="matching-factors-section">
            <h4 className="section-title">Diagnosis Factors</h4>
            <div className="factor-grid">
              <div className="factor-item">
                <span className="factor-label">Symptom Match</span>
                <p className="factor-value">{diagnosis.matchingFactors.symptomMatch}</p>
              </div>
              <div className="factor-item">
                <span className="factor-label">Risk Factors</span>
                <p className="factor-value">{diagnosis.matchingFactors.riskFactorMatch}</p>
              </div>
              <div className="factor-item">
                <span className="factor-label">Travel Risk</span>
                <p className="factor-value">{diagnosis.matchingFactors.travelRiskMatch}</p>
              </div>
              <div className="factor-item">
                <span className="factor-label">Drug History</span>
                <p className="factor-value">{diagnosis.matchingFactors.drugHistoryMatch}</p>
              </div>
            </div>
            {diagnosis.matchingFactors.combinationMatches.length > 0 && (
              <div className="combination-section">
                <h4 className="section-title">Matched Combinations</h4>
                <ul className="combination-list">
                  {diagnosis.matchingFactors.combinationMatches.map((match, idx) => (
                    <li key={idx} className="combination-item">
                      {match.isExactMatch ? 'Exact' : 'Partial'} Match: {match.combination} (
                      {match.matchedSymptoms})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Checker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [redFlag, setRedFlag] = useState(null);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    durationUnit: 'Days',
    severity: '',
  });
  const [drugHistory, setDrugHistory] = useState('');
  const [travelRegion, setTravelRegion] = useState('');
  const [selectedRiskFactors, setSelectedRiskFactors] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedDiagnosis, setExpandedDiagnosis] = useState(null);

  // Load cached data for offline support
  useEffect(() => {
    const cachedData = localStorage.getItem('checkerData');
    if (cachedData) {
      const { symptoms, patientInfo, drugHistory, travelRegion, riskFactors } =
        JSON.parse(cachedData);
      setSelectedSymptoms(symptoms || []);
      setPatientInfo(patientInfo || {
        age: '',
        gender: '',
        duration: '',
        durationUnit: 'Days',
        severity: '',
      });
      setDrugHistory(drugHistory || '');
      setTravelRegion(travelRegion || '');
      setSelectedRiskFactors(riskFactors || []);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(
      'checkerData',
      JSON.stringify({
        symptoms: selectedSymptoms,
        patientInfo,
        drugHistory,
        travelRegion,
        riskFactors: selectedRiskFactors,
      })
    );
  }, [selectedSymptoms, patientInfo, drugHistory, travelRegion, selectedRiskFactors]);

  const handleSymptomSelect = (updatedSymptoms) => {
    setSelectedSymptoms(updatedSymptoms);
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectRiskFactors = (value) => {
    setSelectedRiskFactors(value || []);
  };

  const simulateAnalysis = (result) => {
    setIsAnalyzing(true);
    setProgress(0);

    const intervals = [60, 85, 100];
    let step = 0;

    const interval = setInterval(() => {
      if (step < intervals.length) {
        setProgress(intervals[step]);
        step++;
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setDiagnosis(result.detailed.slice(0, 5));
        setRedFlag(result.redFlag);
        navigator.vibrate?.([100, 50, 100]);
      }
    }, [1000, 800, 700][step] || 700);
  };

  const handleCheckDiagnosis = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    const result = calculateDiagnosis(
      selectedSymptoms,
      parseInt(patientInfo.duration) || 1,
      patientInfo.durationUnit.toLowerCase(),
      patientInfo.severity.toLowerCase(),
      patientInfo.age,
      patientInfo.gender.toLowerCase(),
      drugHistory,
      travelRegion,
      selectedRiskFactors
    );

    if (result.error) {
      setError(result.error);
      setDiagnosis([]);
      alert(result.error);
      return;
    }

    setError(null);
    simulateAnalysis(result);
  };

  const handleClear = () => {
    setSelectedSymptoms([]);
    setDiagnosis([]);
    setRedFlag(null);
    setPatientInfo({
      age: '',
      gender: '',
      duration: '',
      durationUnit: 'Days',
      severity: '',
    });
    setDrugHistory('');
    setTravelRegion('');
    setSelectedRiskFactors([]);
    setError(null);
  };

  return (
    <div className="checker-container" lang={language}>
      <header className="checker-header">
        <h1 className="title">Advanced Symptom Analyzer</h1>
        <select
          className="language-selector"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </header>

      {redFlag && (
        <div className="red-flag-warning" role="alert">
          <span className="warning-icon">⚠️</span>
          <p className="warning-text">{redFlag}</p>
        </div>
      )}

      <SymptomInput
        onSelectSymptoms={handleSymptomSelect}
        patientInfo={patientInfo}
        onPatientInfoChange={handlePatientInfoChange}
        language={language}
      />

      <RiskTravelSelector
        selectedRiskFactors={selectedRiskFactors}
        handleSelectRiskFactors={handleSelectRiskFactors}
        travelRegion={travelRegion}
        setTravelRegion={setTravelRegion}
        riskFactorWeights={riskFactorWeights}
        travelRiskFactors={travelRiskFactors}
      />

      <div className="button-container">
        <CustomButton
          title={isAnalyzing ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
          onPress={handleCheckDiagnosis}
          color="#27c7b8"
          disabled={isAnalyzing}
        />
        <CustomButton
          title="Clear All"
          onPress={handleClear}
          color="#FF6347"
          disabled={isAnalyzing}
        />
      </div>

      {isAnalyzing && (
        <div className="analyzing-container">
          <LoadingBar progress={progress} />
          <p className="analyzing-text">Analyzing symptoms and risk factors...</p>
        </div>
      )}

      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}

      {diagnosis.length > 0 && !isAnalyzing && (
        <div className="results">
          <h2 className="results-title">Diagnostic Analysis Results</h2>
          {diagnosis.map((item, index) => (
            <DiagnosisCard
              key={index}
              diagnosis={item}
              index={index}
              isExpanded={expandedDiagnosis === index}
              onToggle={() => setExpandedDiagnosis(expandedDiagnosis === index ? null : index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Checker;