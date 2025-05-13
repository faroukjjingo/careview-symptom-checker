import React, { useState } from 'react';
import SymptomInput from './SymptomInput';
import calculateDiagnosis from './SymptomCalculations';
import './Checker.css';

const DiagnosisCard = ({ diagnosis, index, isExpanded, onToggle }) => {
  const confidenceColor =
    diagnosis.confidence === 'High'
      ? 'bg-green-100 text-green-800'
      : diagnosis.confidence === 'Medium'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 mb-4 transition-all duration-300"
      role="region"
      aria-labelledby={`diagnosis-${index}`}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => onToggle(index)}
        id={`diagnosis-${index}`}
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {diagnosis.diagnosis}
        </h3>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${confidenceColor}`}
          >
            {diagnosis.confidence}
          </span>
          <span className="text-gray-600">
            {diagnosis.probability}% Likely
          </span>
          <span className="text-gray-500 text-xl">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 text-gray-700">
          <div className="mb-2">
            <h4 className="font-medium">Explanation</h4>
            <p>{diagnosis.explanation}</p>
            <p className="text-sm text-gray-500 mt-1">
              Source: {diagnosis.source}
            </p>
          </div>
          <div className="mb-2">
            <h4 className="font-medium">Matching Symptoms</h4>
            <p>{diagnosis.matchingFactors.symptomMatch || 'None'}</p>
          </div>
          <div className="mb-2">
            <h4 className="font-medium">Matching Combinations</h4>
            {diagnosis.matchingFactors.combinationMatches.length > 0 ? (
              diagnosis.matchingFactors.combinationMatches.map(
                (combo, idx) => (
                  <p key={idx}>
                    {combo.combination} (
                    {combo.isExactMatch ? 'Exact' : 'Partial'})
                  </p>
                )
              )
            ) : (
              <p>None</p>
            )}
          </div>
          <div>
            <h4 className="font-medium">Other Factors</h4>
            <p>
              Risk Factors: {diagnosis.matchingFactors.riskFactorMatch || 'None'}
            </p>
            <p>
              Travel: {diagnosis.matchingFactors.travelRiskMatch || 'None'}
            </p>
            <p>
              Drug History: {diagnosis.matchingFactors.drugHistoryMatch || 'None'}
            </p>
          </div>
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

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSymptomSelect = (symptoms) => {
    setSelectedSymptoms(symptoms);
  };

  const handleCheckDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      setDiagnosis([]);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await calculateDiagnosis(
        selectedSymptoms,
        parseInt(patientInfo.duration) || 1,
        patientInfo.durationUnit,
        patientInfo.severity,
        patientInfo.age,
        patientInfo.gender,
        drugHistory,
        travelRegion,
        selectedRiskFactors
      );

      if (result.error) {
        setError(result.error);
        setDiagnosis([]);
        return;
      }

      setDiagnosis(result.detailed);
      if (result.redFlag) {
        setError(result.redFlag);
      }
    } catch (err) {
      setError('Error analyzing symptoms. Please try again.');
      setDiagnosis([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Symptom Checker
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your symptoms to get a potential diagnosis
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SymptomInput
            onSelectSymptoms={handleSymptomSelect}
            patientInfo={patientInfo}
            onPatientInfoChange={handlePatientInfoChange}
          />

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Additional Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Factors
                </label>
                <select
                  multiple
                  className="w-full p-2 border rounded-md"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Region
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={travelRegion}
                  onChange={(e) => setTravelRegion(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="sub_saharan_africa">Sub-Saharan Africa</option>
                  <option value="southeast_asia">Southeast Asia</option>
                  <option value="south_america">South America</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drug History
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={drugHistory}
                  onChange={(e) => setDrugHistory(e.target.value)}
                  placeholder="e.g., Steroids, Antidepressants"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckDiagnosis}
            disabled={isAnalyzing}
            className={`w-full mt-6 py-3 px-4 rounded-md text-white font-semibold transition-colors ${
              isAnalyzing
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 text-red-800 p-4 rounded-md mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {diagnosis.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Diagnosis Results
            </h2>
            {isAnalyzing ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              diagnosis.map((diag, index) => (
                <DiagnosisCard
                  key={index}
                  diagnosis={diag}
                  index={index}
                  isExpanded={expandedCard === index}
                  onToggle={toggleCard}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checker;