export const riskFactorWeights = {
  "Smoking": {
    "Lung Cancer": 4.0,  // 15-30x increased risk
    "COPD": 3.5,  // Major cause of COPD
    "Heart Disease": 2.5,  // 2-4x increased risk
    "Throat Cancer": 2.8,  // Significant risk increase
    "Mouth Cancer": 2.7,
    "Bladder Cancer": 2.2,
    "Pancreatic Cancer": 2.0,
    "Stroke": 1.8,
    "Peripheral Arterial Disease": 2.3,
    "Diabetes": 1.4
  },
  "Obesity": {  // Changed from "Being Overweight" for medical precision
    "Type 2 Diabetes": 3.0,  // Strong causal relationship
    "Sleep Apnea": 2.8,  // Major risk factor
    "Heart Disease": 2.4,
    "Hypertension": 2.3,
    "Osteoarthritis": 2.0,
    "Certain Cancers": 1.8,  // Specified from "Some Cancers"
    "NAFLD": 2.2,  // Non-alcoholic fatty liver disease
    "Kidney Disease": 1.7,
    "Depression": 1.5,
    "Fertility Issues": 1.6
  },
  "Alcohol Use Disorder": {  // More precise medical term
    "Liver Cirrhosis": 3.0,
    "Alcoholic Hepatitis": 2.8,
    "Pancreatitis": 2.5,
    "Esophageal Cancer": 2.2,
    "Depression": 1.8,
    "Cardiomyopathy": 2.0,
    "Cognitive Impairment": 1.9,
    "Gastritis": 1.7,
    "Hypertension": 1.6,
    "Breast Cancer": 1.4  // For women
  },
  "Physical Inactivity": {  // More precise than "Lack of Exercise"
    "Cardiovascular Disease": 2.0,
    "Type 2 Diabetes": 1.8,
    "Obesity": 1.9,
    "Osteoporosis": 1.7,
    "Colorectal Cancer": 1.5,
    "Depression": 1.6,
    "Cognitive Decline": 1.5,
    "Hypertension": 1.6,
    "Metabolic Syndrome": 1.7,
    "Sarcopenia": 1.8
  },
  "Poor Nutrition": {  // More specific than "Unhealthy Diet"
    "Cardiovascular Disease": 2.2,
    "Type 2 Diabetes": 2.0,
    "Obesity": 2.1,
    "Micronutrient Deficiencies": 1.8,
    "Osteoporosis": 1.6,
    "Colorectal Cancer": 1.7,
    "Hypertension": 1.8,
    "Dental Caries": 1.5,
    "NAFLD": 1.7,
    "Inflammatory Bowel Disease": 1.6
  },
  "Sleep Disorders": {  // More specific than "Sleep Issues"
    "Obesity": 1.8,
    "Cardiovascular Disease": 1.7,
    "Type 2 Diabetes": 1.6,
    "Depression": 1.9,
    "Immune Dysfunction": 1.7,
    "Hypertension": 1.6,
    "Cognitive Impairment": 1.8,
    "Metabolic Syndrome": 1.7,
    "Accidents": 2.0,  // Added due to significance
    "Anxiety": 1.6
  },
  "Chronic Stress": {  // More specific than "High Stress"
    "Cardiovascular Disease": 1.8,
    "Hypertension": 1.9,
    "Major Depression": 2.0,
    "Anxiety Disorders": 1.9,
    "Immune Dysfunction": 1.7,
    "Gastrointestinal Disorders": 1.6,
    "Sleep Disorders": 1.8,
    "Metabolic Syndrome": 1.6,
    "Autoimmune Conditions": 1.5,
    "Cognitive Decline": 1.5
  },
  "Excessive Caffeine": {  // More specific
    "Anxiety Disorders": 1.6,
    "Insomnia": 1.8,
    "Gastric Acid Secretion": 1.5,
    "Hypertension": 1.4,
    "Cardiac Arrhythmias": 1.5,
    "Calcium Malabsorption": 1.3,
    "Headaches": 1.4
  },
  "Genetic Predisposition": {  // More precise than "Family Health History"
    "Certain Cancers": 2.5,
    "Cardiovascular Disease": 2.3,
    "Type 2 Diabetes": 2.2,
    "Alzheimer's Disease": 2.0,
    "Autoimmune Disorders": 2.1,
    "Mental Health Disorders": 1.9,
    "Osteoporosis": 1.7,
    "Hereditary Disease": 3.0,  // Highest for true genetic disorders
    "Hypertension": 1.8,
    "Obesity": 1.7
  },
  "Hypertension": {
    "Stroke": 3.0,  // Major risk factor
    "Cardiovascular Disease": 2.8,
    "Chronic Kidney Disease": 2.5,
    "Retinopathy": 2.0,
    "Cognitive Decline": 1.8,
    "Peripheral Arterial Disease": 2.2,
    "Left Ventricular Hypertrophy": 2.3
  },
  "Hyperlipidemia": {  // More precise than "High Cholesterol"
    "Cardiovascular Disease": 2.5,
    "Atherosclerosis": 2.4,
    "Peripheral Arterial Disease": 2.0,
    "Acute Pancreatitis": 1.8,
    "Stroke": 2.2,
    "Coronary Artery Disease": 2.3
  },
  "UV Exposure": {  // More precise than "Sun Exposure"
    "Melanoma": 3.0,
    "Non-melanoma Skin Cancer": 2.8,
    "Photoaging": 2.0,
    "Cataracts": 1.8,
    "Immunosuppression": 1.5,
    "Age-related Macular Degeneration": 1.7
  },
  "Oral Health": {  // Restructured for clarity
    "Periodontal Disease": 2.0,
    "Cardiovascular Disease": 1.6,
    "Diabetes Complications": 1.7,
    "Respiratory Infections": 1.5,
    "Oral Cancer": 1.8,
    "Systemic Inflammation": 1.6
  },
  "Nutritional Deficiencies": {  // New category combining several previous ones
    "Iron Deficiency": {
      "Anemia": 2.5,
      "Cognitive Impairment": 1.8,
      "Immune Dysfunction": 1.7,
      "Fatigue": 2.0
    },
    "Vitamin D Deficiency": {
      "Osteoporosis": 2.2,
      "Immune Dysfunction": 1.8,
      "Depression": 1.6,
      "Muscle Weakness": 1.7
    },
    "Electrolyte Imbalance": {
      "Cardiac Arrhythmias": 2.3,
      "Muscle Weakness": 2.0,
      "Seizures": 2.2,
      "Dehydration": 1.9
    }
  }
};

export default riskFactorWeights;
