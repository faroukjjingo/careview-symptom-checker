export const travelRiskFactors = {
  'Sub-Saharan Africa': {
    'Malaria': 2.0,  // Highest risk region for malaria
    'Tuberculosis': 1.9,  // Very high burden
    'HIV/AIDS': 1.8,  // Highest prevalence globally
    'Schistosomiasis': 1.6,  // Endemic in many areas
    'Dengue Fever': 1.4,
    'Yellow Fever': 1.5,  // Endemic in many countries
    'Ebola': 1.8,  // Sporadic outbreaks
    'Meningitis': 1.6,  // "Meningitis belt" countries
    'Lassa Fever': 1.4,  // Endemic in West Africa
    'Trypanosomiasis': 1.5  // African sleeping sickness
  },
  'South Asia': {
    'Dengue Fever': 2,  // Very high incidence
    'Tuberculosis': 1.6,  // High burden region
    'Typhoid Fever': 1.7,  // Endemic
    'Japanese Encephalitis': 1.5,  // Endemic in rural areas
    'Malaria': 1.5,  // Significant risk in some areas
    'Hepatitis A': 1.4,
    'Hepatitis E': 1.4,  // Common in region
    'Chikungunya': 1.5,
    'Cholera': 1.4,
    'Nipah Virus': 1.3  // Periodic outbreaks
  },
  'Southeast/East Asia': {
    'Dengue Fever': 1.7,
    'Japanese Encephalitis': 1.6,  // Higher risk in rural areas
    'Hepatitis B': 1.6,  // High prevalence
    'Malaria': 1.4,  // Risk varies by country
    'Hand, Foot, and Mouth Disease': 1.4,  // Common in children
    'Avian Influenza': 1.3,
    'Tuberculosis': 1.4,
    'Hepatitis A': 1.3,
    'Leptospirosis': 1.3,
    'Scrub Typhus': 1.4  // Endemic in region
  },
  'Latin America': {
    'Dengue Fever': 2,  // Very high risk
    'Zika Virus': 1.6,  // Endemic in many areas
    'Chikungunya': 1.5,
    'Chagas Disease': 1.5,  // Endemic
    'Yellow Fever': 1.4,  // Risk in specific areas
    'Malaria': 1.4,  // Risk in specific regions
    'Leishmaniasis': 1.4,
    'Leptospirosis': 1.3,
    'Hepatitis A': 1.3,
    'Tuberculosis': 1.3
  },
  'Middle East': {
    'MERS-CoV': 1.5,  // Endemic in Arabian Peninsula
    'Tuberculosis': 1.4,
    'Hepatitis A': 1.4,
    'Hepatitis B': 1.4,
    'Brucellosis': 1.4,  // Common from dairy products
    'Crimean-Congo Hemorrhagic Fever': 1.3,
    'Leishmaniasis': 1.3,
    'Q Fever': 1.3,
    'Typhoid Fever': 1.3,
    'Sand Fly Fever': 1.3  // Endemic in region
  },
  'North America': {
    'Lyme Disease': 1.4,  // Common in Northeast/Upper Midwest
    'West Nile Virus': 1.3,
    'Hantavirus': 1.2,
    'Rocky Mountain Spotted Fever': 1.3,
    'Valley Fever': 1.3,  // Endemic in Southwest
    'Influenza': 1.2,
    'Tuberculosis': 1.1,
    'Hepatitis A': 1.1,
    'Legionnaires Disease': 1.2,
    'Eastern Equine Encephalitis': 1.2
  },
  'Europe': {
    'Tick-Borne Encephalitis': 1.4,  // Endemic in parts of Europe
    'Lyme Disease': 1.3,
    'Tuberculosis': 1.2,
    'Influenza': 1.2,
    'Hepatitis A': 1.2,
    'West Nile Virus': 1.2,  // Especially Southern Europe
    'Q Fever': 1.2,
    'Hantavirus': 1.2,
    'Legionnaires Disease': 1.2,
    'Crimean-Congo Hemorrhagic Fever': 1.1  // Parts of Eastern Europe
  },
  'Oceania': {
    'Dengue Fever': 1.5,  // Pacific Islands
    'Ross River Virus': 1.4,  // Australia
    'Melioidosis': 1.4,  // Northern Australia
    'Japanese Encephalitis': 1.3,  // Parts of PNG
    'Tuberculosis': 1.3,  // High in PNG and Pacific Islands
    'Zika Virus': 1.3,  // Pacific Islands
    'Chikungunya': 1.3,
    'Murray Valley Encephalitis': 1.3,  // Australia
    'Hepatitis B': 1.2,
    'Leptospirosis': 1.2
  }
};

export default travelRiskFactors;