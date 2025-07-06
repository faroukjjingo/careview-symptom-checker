// Checker.jsx
import React, { useState, useEffect } from 'react';
import SymptomInput from './SymptomInput';
import calculateDiagnosis from './SymptomCalculations';
import { guidance } from './guidance';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  LinearProgress,
  CircularProgress,
  styled,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  boxShadow: theme.shadows[3],
  '&:hover': { boxShadow: theme.shadows[5] },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-root': {
    borderRadius: 8,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ConfidenceChip = styled(Chip)(({ theme, confidence }) => ({
  backgroundColor:
    confidence === 'High'
      ? theme.palette.success.light
      : confidence === 'Medium'
      ? theme.palette.warning.light
      : theme.palette.error.light,
  color: theme.palette.getContrastText(
    confidence === 'High'
      ? theme.palette.success.light
      : confidence === 'Medium'
      ? theme.palette.warning.light
      : theme.palette.error.light
  ),
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  margin: theme.spacing(2, 0),
}));

const DiagnosisCard = ({
  diagnosis,
  probability,
  confidence,
  index,
  isExpanded,
  onToggle,
  explanation,
}) => {
  const guidanceData = guidance[diagnosis.toLowerCase()];
  return (
    <StyledCard>
      <CardHeader
        title={diagnosis}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ConfidenceChip label={confidence} confidence={confidence} />
            <Typography variant="body2">{probability}% Likely</Typography>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </Box>
        }
        onClick={() => onToggle(index)}
        sx={{ cursor: 'pointer' }}
      />
      <Collapse in={isExpanded}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Explanation
          </Typography>
          <Typography variant="body2" paragraph>
            {explanation}
          </Typography>
          {guidanceData ? (
            <>
              <Typography variant="h6" gutterBottom>
                Guidance
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Next Steps:</strong> {guidanceData.steps}
              </Typography>
              <Typography variant="body2" component="div">
                <div dangerouslySetInnerHTML={{ __html: guidanceData.content.replace(/\n/g, '<br />') }} />
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" paragraph>
              No specific guidance available for {diagnosis}. Consult a healthcare provider for further evaluation.
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </StyledCard>
  );
};

const Checker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    durationUnit: 'Days',
    severity: 'Moderate',
  });
  const [selectedRiskFactors, setSelectedRiskFactors] = useState([]);
  const [travelRegion, setTravelRegion] = useState('');
  const [drugHistory, setDrugHistory] = useState('');
  const [diagnosis, setDiagnosis] = useState([]);
  const [errorMessage, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectSymptoms = (symptoms) => {
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
          if (result.redFlag) setError(result.redFlag);
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
    setError('');

    try {
      const result = await calculateDiagnosis(
        selectedSymptoms,
        parseInt(patientInfo.duration) || 1,
        patientInfo.durationUnit,
        patientInfo.severity,
        patientInfo.age || 30,
        patientInfo.gender,
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

  useEffect(() => {
    document.body.style.cursor = isAnalyzing ? 'wait' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isAnalyzing]);

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto', padding: 3 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          CareView
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Input your symptoms to explore potential diagnoses
        </Typography>
      </Box>

      <SymptomInput
        onSelectSymptoms={handleSelectSymptoms}
        patientInfo={patientInfo}
        onPatientInfoChange={handlePatientInfoChange}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Additional Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <StyledFormControl>
            <InputLabel id="risk-select-label">Risk Factors</InputLabel>
            <Select
              labelId="risk-select-label"
              label="Risk Factors"
              multiple
              value={selectedRiskFactors}
              onChange={(e) => setSelectedRiskFactors(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Smoking', 'Diabetes', 'Hypertension', 'Obesity'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <StyledFormControl>
            <InputLabel id="travel-select-label">Travel Region</InputLabel>
            <Select
              labelId="travel-select-label"
              label="Travel Region"
              value={travelRegion}
              onChange={(e) => setTravelRegion(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="sub_saharan_africa">Sub-Saharan Africa</MenuItem>
              <MenuItem value="southeast_asia">Southeast Asia</MenuItem>
              <MenuItem value="south_america">South America</MenuItem>
            </Select>
          </StyledFormControl>
          <TextField
            fullWidth
            label="Drug History"
            value={drugHistory}
            onChange={(e) => setDrugHistory(e.target.value)}
            placeholder="e.g., Steroids, Antidepressants"
            sx={{ marginBottom: 2 }}
          />
        </Box>
        <StyledButton
          variant="contained"
          fullWidth
          onClick={handleCheckDiagnosis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
        </StyledButton>
      </Box>

      {errorMessage && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}>
          {errorMessage}
        </Typography>
      )}

      {diagnosis.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Diagnosis Results
          </Typography>
          {isAnalyzing ? (
            <ProgressContainer>
              <CircularProgress size={24} />
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress variant="determinate" value={analysisProgress} />
              </Box>
            </ProgressContainer>
          ) : (
            diagnosis.map((diag, index) => (
              <DiagnosisCard
                key={index}
                diagnosis={diag.diagnosis}
                probability={diag.probability}
                confidence={diag.confidence}
                index={index}
                isExpanded={expandedCard === index}
                onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                explanation={diag.explanation}
              />
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default Checker;