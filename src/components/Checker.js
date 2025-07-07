import React from 'react';
import { SymptomCheckerProvider } from '../context/SymptomCheckerContext';
import SymptomChat from './SymptomChat';
import SymptomInput from './SymptomInput';
import DiagnosisCard from './DiagnosisCard';
import { guidance } from '../data/guidance';
import { travelRiskFactors } from '../data/TravelRiskFactors';
import { riskFactorWeights } from '../data/RiskFactorWeights';
import drugHistoryWeights from '../data/DrugHistoryWeights';

const Checker = () => {
  return (
    <SymptomCheckerProvider initialPatientInfo={{ travelRiskFactors, riskFactorWeights, drugHistoryWeights }}>
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">CareView Symptom Checker</h1>
          <p className="text-sm text-muted-foreground mt-2">Developed by trusted healthcare professionals to explore possible diagnoses. Always consult a doctor for medical advice.</p>
        </div>

        <SymptomChat />

        <SymptomInput />

        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary">Possible Diagnoses</h2>
          <DiagnosisCard guidance={guidance} />
        </div>
      </div>
    </SymptomCheckerProvider>
  );
};

export default Checker;