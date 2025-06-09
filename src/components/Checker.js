import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Box, CircularProgress, Select, MenuItem, InputLabel, FormControl, TextField, Collapse, Chip, Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SymptomInput from './SymptomInput';
import calculateDiagnosis from './SymptomCalculations';
import './Checker.css';

const DiagnosisCard = ({ diagnosis, probability, confidence, matchingFactors, index, isExpanded, onToggle, source, explanation }) => {
  const confidenceColor = confidence === 'High' ? '#4caf50' : confidence === 'Medium' ? '#fbc02d' : '#f44336';

  return (
    <Paper elevation={3} className="diagnosis-card" role="region" aria-labelledby={`diagnosis-${index}`}>
      <Box className="card-header" onClick={() => onToggle(index)}>
        <Typography variant="h6">{diagnosis}</Typography>
        <Box className="card-header-right">
          <Chip label={confidence} style={{ backgroundColor: confidenceColor, color: '#fff' }} />
          <Typography variant="body2">{probability}% Likely</Typography>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Box>
      </Box>
      <Collapse in={isExpanded}>
        <Box className="card-content">
          <Typography variant="subtitle2">Explanation</Typography>
          <Typography variant="body2">{explanation}</Typography>
          <Typography variant="caption" color="textSecondary">Source: {source}</Typography>
          <Typography variant="subtitle2">Matching Symptoms</Typography>
          <Typography variant="body2">{matchingFactors.symptomMatch || 'None'}</Typography>
          <Typography variant="subtitle2">Matching Combinations</Typography>
          {matchingFactors.combinationMatches.length > 0 ? (
            matchingFactors.combinationMatches.map((combo, idx) => (
              <Typography key={idx} variant="body2">{combo.combination} ({combo.isExactMatch ? 'Exact' : 'Partial'})</Typography>
            ))
          ) : (
            <Typography variant="body2">None</Typography>
          )}
          <Typography variant="subtitle2">Other Factors</Typography>
          <Typography variant="body2">Risk Factors: {matchingFactors.riskFactorMatch || 'None'}</Typography>
          <Typography variant="body2">Travel: {matchingFactors.travelRiskMatch || 'None'}</Typography>
          <Typography variant="body2">Drug History: {matchingFactors.drugHistoryMatch || 'None'}</Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

const Checker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    durationUnit: 'Days',
    severity: ''
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
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomSelect = (symptoms) => {
    setSelectedSymptoms(symptoms);
  };

  const simulateAnalysis = (result) => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
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
    <Container maxWidth="md" className="checker-container">
      <Box textAlign="center" my={4}>
        <Typography variant="h4">Symptom Checker</Typography>
        <Typography variant="body1" color="textSecondary">Enter your symptoms to get a potential diagnosis</Typography>
      </Box>

      <Paper elevation={3} className="input-section">
        <SymptomInput
          onSelectSymptoms={handleSymptomSelect}
          patientInfo={patientInfo}
          onPatientInfoChange={handlePatientInfoChange}
        />

        <Box className="additional-inputs">
          <Typography variant="h6">Additional Factors</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Risk Factors</InputLabel>
                <Select
                  multiple
                  value={selectedRiskFactors}
                  onChange={(e) => setSelectedRiskFactors(e.target.value)}
                >
                  <MenuItem value="smoking">Smoking</MenuItem>
                  <MenuItem value="diabetes">Diabetes</MenuItem>
                  <MenuItem value="hypertension">Hypertension</MenuItem>
                  <MenuItem value="obesity">Obesity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Travel Region</InputLabel>
                <Select
                  value={travelRegion}
                  onChange={(e) => setTravelRegion(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="sub_saharan_africa">Sub-Saharan Africa</MenuItem>
                  <MenuItem value="southeast_asia">Southeast Asia</MenuItem>
                  <MenuItem value="south_america">South America</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Drug History"
                value={drugHistory}
                onChange={(e) => setDrugHistory(e.target.value)}
                placeholder="e.g., Steroids, Antidepressants"
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleCheckDiagnosis}
            disabled={isAnalyzing}
            className="check-button"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" className="error-message">{error}</Alert>
      )}

      {diagnosis.length > 0 && (
        <Paper elevation={3} className="results-section">
          <Typography variant="h5">Diagnosis Results</Typography>
          {isAnalyzing ? (
            <Box className="progress-container">
              <CircularProgress />
              <Box className="progress-bar">
                <Box className="progress" style={{ width: `${analysisProgress}%` }}></Box>
              </Box>
            </Box>
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
                explanation={diag.explanation}
              />
            ))
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Checker;