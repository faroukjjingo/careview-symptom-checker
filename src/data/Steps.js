export const steps = [
  { name: 'welcome', validate: (value) => ['start', 'help'].includes(value.toLowerCase()) },
  { name: 'age', validate: (value) => !isNaN(value) && value > 0 && value <= 120 },
  { name: 'gender', validate: (value) => ['male', 'female', 'other'].includes(value.toLowerCase()) },
  { name: 'symptoms', validate: (value) => Array.isArray(value) && value.length >= 2 },
  { name: 'duration', validate: (value) => !isNaN(value) && value > 0 },
  { name: 'durationUnit', validate: (value) => ['days', 'weeks', 'months'].includes(value.toLowerCase()) },
  { name: 'severity', validate: (value) => ['mild', 'moderate', 'severe'].includes(value.toLowerCase()) },
  { name: 'travelRegion', validate: (value, travelRiskFactors) => ['none', ...Object.keys(travelRiskFactors || {})].map(v => v.toLowerCase()).includes(value.toLowerCase()) },
  { name: 'riskFactors', validate: (value, riskFactorWeights) => Array.isArray(value) && (value.length === 0 || value.every((v) => Object.keys(riskFactorWeights || {}).includes(v))) },
  { name: 'drugHistory', validate: (value, drugHistoryWeights) => Array.isArray(value) && (value.length === 0 || value.every((v) => drugHistoryWeights.includes(v))) },
  { name: 'submit', validate: () => true },
];