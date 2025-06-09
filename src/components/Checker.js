import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SymptomInput from './SymptomInput';
import calculateDiagnosis from './SymptomCalculations';
import './Checker.css';

const DiagnosisCard = ({ diagnosis, probability, confidence, matchingFactors, index, isExpanded, onToggle, source, explanation }) => {
  return (
    <div className="diagnosis-card" role="region" aria-labelledby={`diagnosis-${index}`}>
      <div className="card-header" onClick={() => onToggle(index)}>
        <h3 id={`diagnosis-${index}`}>{diagnosis}</h3>
        <div className="card-header-right">
          <span className={`confidence-chip ${confidence.toLowerCase()}`}>{confidence}</span>
          <span>{probability}% Likely</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {isExpanded && (
        <div className="card-content">
          <h4>Explanation</h4>
          <p>{explanation}</p>
          <p className="source">Source: {source}</p>
          <h4>Matching Symptoms</h4>
          <p>{matchingFactors.symptomMatch || 'None'}</p>
          <h4>Matching Combinations</h4>
          {matchingFactors.combinationMatches.length > 0 ? (
            matchingFactors.combinationMatches.map((combo, idx) => (
              <p key={idx}>
                {combo.combination} ({combo.isExactMatch ? 'Exact' : 'Partial'})
              </p>
            ))
          ) : (
            <p className="none">None</p>
          )}
          <h4>Other Factors</h4>
          <p>Risk Factors: {matchingFactors.riskFactorMatch || 'None'}</p>
          <p>Travel: {matchingFactors.travelRiskMatch || 'None'}</p>
          <p>Drug History: {matchingFactors.drugHistoryMatch || 'None'}</p>
        </div>
      )}
    </div>
  );
};

const Checker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    durationUnit: 'Days',
    severity: '',
  });
  const [selectedRiskFactors, setSelectedRiskFactors] = useState([]);
  const [travelRegion, setTravelRegion] = useState('');
  const [drugHistory, setDrugHistory] = useState('');
  const [diagnosis, setDiagnosis] = useState([]);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSymptomSelect = (symptoms) => {
    setSelectedSymptoms(symptoms);
  };

  const simulateAnalysis = (result) => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setDiagnosis(result.detailed);
          if (result.redFlag) {
            setError(result.redFlag);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCheckDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      setDiagnosis([]);
      alert('Please select at least one symptom.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await calculateDiagnosis(
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
        setIsAnalyzing(false);
        return;
      }

      simulateAnalysis(result);
    } catch (err) {
      setError('Error analyzing symptoms. Please try again.');
      setDiagnosis([]);
      alert('Error analyzing symptoms.');
      setIsAnalyzing(false);
    }
  };

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  useEffect(() => {
    document.body.style.cursor = isAnalyzing ? 'wait' : 'default';
  }, [isAnalyzing]);

  return (
    <div className="checker-container">
      <div className="checker-header">
        <h1>Symptom Checker</h1>
        <p>Enter your symptoms to get a potential diagnosis</p>
      </div>

      <div className="input-section">
        <SymptomInput
          onSelectSymptoms={handleSymptomSelect}
          patientInfo={patientInfo}
          onPatientInfoChange={handlePatientInfoChange}
        />

        <div class="additional-inputs">
          <h2>Additional Factors</h2>
          <div class="grid-container">
            <div class="form-group">
              <label for="risk-select">Risk Factors</label>
              <select
                id="risk-select"
                multiple
                value={selectedRiskFactors}
                onChange={(e) =>
                  setSelectedRiskFactors(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
              >
                <option value="smoking">Smoking</option>
                <option value="diabetes">Diabetes</option>
                <option value="hypertension">Hypertension</option>
                <option value="obesity">Obesity</option>
              </select>
            </div>
            <div class="form-group">
              <label for="travel-select">Travel Region</label>
              <select
                id="travel-select"
                value={travelRegion}
                onChange={(e) => setTravelRegion(e.target.value)}
              >
                <option value="">None</option>
                <option value="sub_saharan_africa">Sub-Saharan Africa</option>
                <option value="southeast_asia">Southeast Asia</option>
                <option value="south_america">South America</option>
              </select>
            </div>
            <div class="form-group">
              <label for="drug-history">Drug History</label>
              <input
                type="text"
                id="drug-history"
                value={drugHistory}
                onChange={(e) => setDrugHistory(e.target.value)}
                placeholder="e.g., Steroids, Antidepressants"
              />
            </div>
          </div>
          <button
            class="check-button"
              onClick={handleCheckDiagnosis}
              disabled={isAnalyzing}}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>
      </div>

      {error && (
        <div class="error-message">{error}</div>
      )}

      {diagnosis.length > 0 && (
        <div class="results-section">
          <h2>Diagnosis Results</h2>
          {isAnalyzing ? (
            <div class="progress-container">
              <div class="progress-spinner"></div>
              <div class="progress-bar">
                <div class="progress" style={{ width: `${analysisProgress}%` }}></div>
              </div>
            </div>
          ) : (
            diagnosis.map((diag, index) => (
              <DiagnosisCard
                key={index}
                diagnosis={diag.diagnosis}
                probability={diag.probability}
                confidence={diag.confidence}
                matchingFactors={diag.matchingFactors}
                index={index}
                isExpanded={expandedCard === index}
                onToggle={toggleCard}
                source={diag.source}
                explanation={diagnosis.explanation}}
              />
            ))}
          )}
        </div>
      )}
    </div>
  );
};

export default Checker;