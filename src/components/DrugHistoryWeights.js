const drugHistoryWeights = {
    "antimalarial": {
        "malaria": 1, 
        "typhoid fever": 2, 
        "dengue fever": 2,  
    },
    "antibiotics": {
        "malaria": 1.2, 
        "typhoid fever": 1.6, 
        "pneumonia": 1.2 
    },
    "antiviral": {
        "COVID-19": 1.4, 
        "influenza": 1.6  
    },
    "painkillers": {
        "headache": 1.8, 
        "back pain": 1.6 
    },
    "antihistamines": {
        "allergies": 1.2, 
        "hives": 1.4 
    },
    "steroids": {
        "asthma": 1.6, 
        "arthritis": 1.8 
    },
    "anti-inflammatory": {
        "rheumatoid arthritis": 1.4, 
        "psoriasis": 1.6 
    },
    "anticoagulants": {
        "deep vein thrombosis": 1.2, 
        "pulmonary embolism": 1.4 
    },
    "anticonvulsants": {
        "epilepsy": 1.6, 
        "seizures": 1.8 
    },
    "muscle relaxants": {
        "muscle strain": 1.4, 
        "fibromyalgia": 1.6 
    },
    "bronchodilators": {
        "chronic obstructive pulmonary disease (COPD)": 1.2, 
        "emphysema": 1.4 
    },
    "anti-anxiety": {
        "anxiety disorder": 1.6, 
        "panic disorder": 1.8 
    },
    "antidepressants": {
        "depression": 1.4, 
        "bipolar disorder": 1.6 
    },
    "anti-diabetic": {
        "type 1 diabetes": 1.2, 
        "type 2 diabetes": 1.4 
    },
    "anti-hypertensive": {
        "hypertension": 1.6, 
        "heart failure": 1.8 
    },
    "anti-asthmatic": {
        "asthma": 1.4, 
        "chronic bronchitis": 1.6 
    },
    
    

    "anti-ulcer": {
        "peptic ulcer": 1.2, 
        "gastroesophageal reflux disease (GERD)": 1.4 
    },
    "anti-gout": {
        "gout": 1.6, 
        "hyperuricemia": 1.8 
    },
    "anti-thyroid": {
        "hyperthyroidism": 1.4, 
        "hypothyroidism": 1.6 
    },
    "anti-Parkinson's": {
        "Parkinson's disease": 1.6, 
        "dystonia": 1.8 
    },
    "anti-Alzheimer's": {
        "Alzheimer's disease": 1.4, 
        "dementia": 1.6 
    },
    "anti-osteoporosis": {
        "osteoporosis": 1.6, 
        "osteopenia": 1.8 
    },
    "anti-glaucoma": {
        "glaucoma": 1.4, 
        "cataracts": 1.6 
    },
    "anti-migraine": {
        "migraine": 1.6, 
        "cluster headache": 1.8 
    },
    "anti-ADD/ADHD": {
        "attention deficit hyperactivity disorder (ADD/ADHD)": 1.4, 
        "narcissistic personality disorder": 1.6 
    },
    "anti-schizophrenia": {
        "schizophrenia": 1.6, 
        "bipolar disorder": 1.8 
    },
    
      
        "allopurinol": {
            "gout": 1.6,
            "hyperuricemia": 1.8
        },
        "levothyroxine": {
            "hypothyroidism": 1.4,
            "goiter": 1.6
        },
       
        "donepezil": {
            "Alzheimer's disease": 1.4,
            "dementia": 1.6
        },
      
        "timolol": {
            "glaucoma": 1.4,
            "ocular hypertension": 1.6
        },
        "sumatriptan": {
            "migraine": 1.6,
            "cluster headache": 1.8
        },
        "methylphenidate": {
            "attention deficit hyperactivity disorder (ADHD)": 1.4,
            "narcolepsy": 1.6
        },
        "risperidone": {
            "schizophrenia": 1.6,
            "bipolar disorder": 1.8
        },
      
        "etanercept": {
            "rheumatoid arthritis": 1.6,
            "psoriatic arthritis": 1.8
        },
     
        "isotretinoin": {
            "severe acne": 1.6,
            "rosacea": 1.8
        },
        "entecavir": {
            "hepatitis B": 1.4,
            "liver cirrhosis": 1.6
        },
        "ondansetron": {
            "chemotherapy-induced nausea": 1.6,
            "postoperative nausea": 1.8
        },
      
    
        "oseltamivir": {
            "influenza A": 1.4,
            "influenza B": 1.6
        },
     
        "zolpidem": {
            "insomnia": 1.4,
            "sleep-wake cycle disruption": 1.6
        },
        "alprazolam": {
            "generalized anxiety disorder": 1.6,
            "panic disorder": 1.8
        },
      
        "interferon beta-1a": {
            "multiple sclerosis": 1.6,
            "clinically isolated syndrome": 1.8
        },
        "sildenafil": {
            "erectile dysfunction": 1.4,
            "pulmonary arterial hypertension": 1.6
        },
     
       
        "leuprolide": {
            "endometriosis": 1.6,
            "uterine fibroids": 1.8
        },
        "estradiol": {
            "menopausal symptoms": 1.4,
            "osteoporosis": 1.6
        },
        "celecoxib": {
            "osteoarthritis": 1.6,
            "rheumatoid arthritis": 1.8
        },
        "tacrolimus": {
            "atopic dermatitis": 1.4,
            "organ transplant rejection": 1.6
        },
        "infliximab": {
            "Crohn's disease": 1.6,
            "ulcerative colitis": 1.8
        },
        "ivacaftor": {
            "cystic fibrosis": 1.4,
            "pancreatic insufficiency": 1.6
        },
        "pirfenidone": {
            "idiopathic pulmonary fibrosis": 1.6,
            "systemic sclerosis": 1.8
        },
        "tetrabenazine": {
            "Huntington's disease": 1.4,
            "tardive dyskinesia": 1.6
        },
        "riluzole": {
            "amyotrophic lateral sclerosis (ALS)": 1.6,
            "bulbar palsy": 1.8
        },
        "modafinil": {
            "narcolepsy": 1.4,
            "shift work sleep disorder": 1.6
        },
        "ropinirole": {
            "restless legs syndrome": 1.6,
            "Parkinson's disease": 1.8
        },
        "hydroxyurea": {
            "sickle cell disease": 1.4,
            "chronic myeloid leukemia": 1.6
        },
        "factor VIII": {
            "hemophilia A": 1.6,
            "von Willebrand disease": 1.8
        },
        "deferoxamine": {
            "beta-thalassemia": 1.4,
            "iron overload": 1.6
        },
     
     
        "lenalidomide": {
            "multiple myeloma": 1.6,
            "myelodysplastic syndromes": 1.8
        },
      
        "enzalutamide": {
            "prostate cancer": 1.6,
            "castration-resistant prostate cancer": 1.8
        },
        "erlotinib": {
            "non-small cell lung cancer": 1.4,
            "pancreatic cancer": 1.6
        },
        "bevacizumab": {
            "colorectal cancer": 1.6,
            "glioblastoma": 1.8
        },
        "ipilimumab": {
            "melanoma": 1.4,
            "renal cell carcinoma": 1.6
        },
        "olaparib": {
            "ovarian cancer": 1.6,
            "breast cancer": 1.8
        },
        "gemcitabine": {
            "pancreatic cancer": 1.4,
            "bladder cancer": 1.6
        },
        "lenvatinib": {
            "thyroid cancer": 1.6,
            "hepatocellular carcinoma": 1.8
        },
        "sunitinib": {
            "renal cell carcinoma": 1.4,
            "gastrointestinal stromal tumors": 1.6
        },
        "pembrolizumab": {
            "melanoma": 1.6,
            "non-small cell lung cancer": 1.8
        },
        "sorafenib": {
            "hepatocellular carcinoma": 1.4,
            "renal cell carcinoma": 1.6
        },
        "trastuzumab": {
            "HER2-positive breast cancer": 1.6,
            "gastric cancer": 1.8
        },
        "nivolumab": {
            "melanoma": 1.4,
            "non-small cell lung cancer": 1.6
        },
        "temozolomide": {
            "glioblastoma": 1.6,
            "anaplastic astrocytoma": 1.8
        },
        "cisplatin": {
            "testicular cancer": 1.4,
            "ovarian cancer": 1.6
        },
        "doxorubicin": {
            "breast cancer": 1.6,
            "soft tissue sarcoma": 1.8
        },
        "tenofovir": {
            "HIV infection": 1.4,
            "hepatitis B": 1.6
        },
        "sofosbuvir": {
            "hepatitis C": 1.6,
            "liver cirrhosis": 1.8
        },
        "artemether/lumefantrine": {
            "malaria": 1.4,
            "falciparum malaria": 1.6
        },
        "daclatasvir": {
            "hepatitis C": 1.6,
            "liver fibrosis": 1.8
        },
        "ribavirin": {
            "hepatitis C": 1.4,
            "respiratory syncytial virus": 1.6
        },
        "peginterferon alfa-2a": {
            "hepatitis B": 1.6,
            "hepatitis C": 1.8
        },
      
      
        "ivermectin": {
            "onchocerciasis": 1.4,
            "strongyloidiasis": 1.6
        },
        "mefloquine": {
            "malaria prevention": 1.6,
            "malaria treatment": 1.8
        },
        "miltefosine": {
            "leishmaniasis": 1.4,
            "free-living ameba infections": 1.6
        },
        "benznidazole": {
            "Chagas disease": 1.6,
            "trypanosomiasis": 1.8
        },
        "amphotericin B": {
            "systemic fungal infections": 1.4,
            "leishmaniasis": 1.6
        },
        "nifurtimox": {
            "Chagas disease": 1.6,
            "sleeping sickness": 1.8
        },
        "paromomycin": {
            "amebiasis": 1.4,
            "cryptosporidiosis": 1.6
        },
      
        "rifabutin": {
            "mycobacterium avium complex": 1.6,
            "tuberculosis": 1.8
        },
      
     
   
        "nitrofurantoin": {
            "urinary tract infections": 1.6,
            "cystitis": 1.8
        },
        "clindamycin": {
            "bacterial vaginosis": 1.4,
            "toxoplasmosis": 1.6
        },
        "trimethoprim-sulfamethoxazole": {
            "pneumocystis pneumonia": 1.6,
            "urinary tract infections": 1.8
        },
        "vancomycin": {
            "methicillin-resistant Staphylococcus aureus": 1.4,
            "Clostridium difficile infection": 1.6
        },
        "meropenem": {
            "complicated intra-abdominal infections": 1.6,
            "bacterial meningitis": 1.8
        },
  
        "colistin": {
            "multidrug-resistant gram-negative infections": 1.6,
            "Acinetobacter infections": 1.8
        },
        "tigecycline": {
            "complicated skin and skin structure infections": 1.4,
            "complicated intra-abdominal infections": 1.6
        },
        "caspofungin": {
            "invasive aspergillosis": 1.6,
            "esophageal candidiasis": 1.8
        },
        "voriconazole": {
            "invasive aspergillosis": 1.4,
            "candidemia": 1.6
        },
        "micafungin": {
            "esophageal candidiasis": 1.6,
            "invasive candidiasis": 1.8
        },
            
      
        
            "gliclazide": {
                "type 2 diabetes": 1.4,
                "hypoglycemia": 1.4
            },
         
        
        
            
            "atorvastatin": {
                "hypercholesterolemia": 1.2,
                "cardiovascular disease": 1.4,
                "myopathy": 1.3,
                "liver dysfunction": 1.2
            },
         
        
          
            "rivaroxaban": {
                "atrial fibrillation": 1.45,
                "pulmonary embolism": 1.4,
                "gastrointestinal bleeding": 1.4
            },
        
         
         
            "bupropion": {
                "major depressive disorder": 1.4,
                "seasonal affective disorder": 1.45,
                "seizures": 1.4
            },
        
            
            "olanzapine": {
                "schizophrenia": 1.4,
                "bipolar disorder": 1.45,
                "weight gain": 1.6,
                "diabetes": 1.3
            },
            
        
            
            "lamotrigine": {
                "epilepsy": 1.4,
                "bipolar disorder": 1.45,
                "Stevens-Johnson syndrome": 1.3
            },
   
         
            
            "esomeprazole": {
                "gastroesophageal reflux disease": 1.2,
                "peptic ulcer": 1.4,
                "Clostridium difficile infection": 1.3,
                "osteoporosis": 1.2
            },
        
        
         
            "amoxicillin": {
                "strep throat": 1.4,
                "pneumonia": 1.45,
                "Clostridium difficile infection": 1.4
            },
        
            
         
            "budesonide": {
                "Crohn's disease": 1.45,
                "ulcerative colitis": 1.4,
                "oral candidiasis": 1.3
            },
        
            
           
            "tiotropium": {
                "chronic obstructive pulmonary disease": 1.4,
                "asthma": 1.6,
                "urinary retention": 1.2
            },
        
            
            "cetirizine": {
                "allergic rhinitis": 1.4,
                "urticaria": 1.45,
                "drowsiness": 1.3
            },
            "fexofenadine": {
                "seasonal allergies": 1.45,
                "chronic idiopathic urticaria": 1.4,
                "headache": 1.1
            },
        

            "terbinafine": {
                "onychomycosis": 1.4,
                "tinea corporis": 1.45,
                "liver failure": 1.2,
                "taste disturbance": 1.3
            },
        
         
   
            "mycophenolate": {
                "kidney transplant rejection": 1.25,
                "lupus nephritis": 1.4,
                "progressive multifocal leukoencephalopathy": 1.2
            },
        
        
         
            
        
            "rituximab": {
                "non-Hodgkin's lymphoma": 1.2,
                "rheumatoid arthritis": 1.4,
                "progressive multifocal leukoencephalopathy": 1.3
            },
        
            
         
            "propylthiouracil": {
                "hyperthyroidism": 1.45,
                "thyroid storm": 1.4,
                "liver failure": 1.4
            },
        
            
      
            
       
            "digoxin": {
                "atrial fibrillation": 1.45,
                "heart failure": 1.4,
                "digitalis toxicity": 1.5
            },
        
         
            "pramipexole": {
                "Parkinson's disease": 1.4,
                "restless legs syndrome": 1.45,
                "impulse control disorders": 1.3
            },
        
            
            "oxybutynin": {
                "overactive bladder": 1.45,
                "urinary incontinence": 1.4,
                "cognitive impairment": 1.3,
                "dry mouth": 1.4
            },
            "tolterodine": {
                "overactive bladder": 1.4,
                "urinary frequency": 1.45,
                "constipation": 1.2
            },
        
            
            "dabigatran": {
                "atrial fibrillation": 1.4,
                "deep vein thrombosis": 1.45,
                "gastrointestinal bleeding": 1.4
            },
           
            
          
            "febuxostat": {
                "gout": 1.45,
                "hyperuricemia": 1.4,
                "cardiovascular events": 1.2
            },
        
          
            "zoledronic acid": {
                "osteoporosis": 1.45,
                "bone metastases": 1.4,
                "hypocalcemia": 1.3
            },
        
         
            "efavirenz": {
                "HIV infection": 1.45,
                "neuropsychiatric side effects": 1.4,
                "lipodystrophy": 1.2
            },
        
            
         
            "acitretin": {
                "psoriasis": 1.45,
                "lichen planus": 1.4,
                "teratogenicity": 1.5,
                "hyperlipidemia": 1.3
            },
        
         
            "valproic acid": {
                "epilepsy": 1.45,
                "bipolar disorder": 1.4,
                "hepatotoxicity": 1.4,
                "neural tube defects": 1.5
            },
        
            
            "chloroquine": {
                "malaria": 1.4,
                "lupus erythematosus": 1.45,
                "retinopathy": 1.3,
                "cardiomyopathy": 1.2
            },
           
            
                "Oral Contraceptives": {
                    "deep vein thrombosis": 1.2, 
                    "pulmonary embolism": 1.3, 
                    "stroke": 1.1, 
                    "myocardial infarction": 1.2 
                },
                "Hormone Replacement Therapy (HRT)": {
                    "breast cancer": 1.1, 
                    "endometrial cancer": 1.2, 
                    "stroke": 1.1, 
                    "venous thromboembolism": 1.3 
                },
                "Corticosteroids": {
                    "osteoporosis": 1.2, 
                    "glaucoma": 1.1, 
                    "hypertension": 1.1, 
                    "diabetes": 1.2 
                },
                "Thiazolidinediones": {
                    "heart failure": 1.2, 
                    "myocardial infarction": 1.1, 
                    "stroke": 1.1, 
                    "fractures": 1.2 
                },
                "Selective Serotonin Reuptake Inhibitors (SSRIs)": {
                    "bleeding disorders": 1.1, 
                    "osteoporosis": 1.2, 
                    "hyponatremia": 1.1, 
                    "suicidal thoughts": 1.2 
                },
                "Nonsteroidal Anti-Inflammatory Drugs (NSAIDs)": {
                    "peptic ulcer": 1.2, 
                    "gastrointestinal bleeding": 1.3, 
                    "hypertension": 1.1, 
                    "kidney disease": 1.2 
                },
            
                "Angiotensin-Converting Enzyme (ACE) Inhibitors": {
                    "cough": 1.1, 
                    "angioedema": 1.2, 
                    "hyperkalemia": 1.1, 
                    "renal failure": 1.2 
                },
                "Calcium Channel Blockers": {
                    "edema": 1.1, 
                    "constipation": 1.2, 
                    "bradycardia": 1.1, 
                    "heart block": 1.2 
                },
                "Statins": {
                    "myopathy": 1.1, 
                    "rhabdomyolysis": 1.2, 
                    "liver damage": 1.1, 
                    "diabetes": 1.2 
                },
                "Proton Pump Inhibitors (PPIs)": {
                    " Clostridioides difficile infection": 1.2, 
                    "pneumonia": 1.1, 
                    "osteoporosis": 1.2, 
                    "vitamin B12 deficiency": 1.1 
                },
                    
           
                    "metoprolol": {
                        "hypertension": 1.45,
                        "angina": 1.4,
                        "heart failure": 1.6,
                        "atrial fibrillation": 1.65,
                        "migraine prophylaxis": 1.8,
                        "bronchospasm": 1.3,
                        "bradycardia": 1.2
                    },
                    "amlodipine": {
                        "hypertension": 1.4,
                        "coronary artery disease": 1.45,
                        "peripheral edema": 1.4,
                        "flushing": 1.2
                    },
                  
                    "clopidogrel": {
                        "acute coronary syndrome": 1.4,
                        "stroke prevention": 1.45,
                        "peripheral artery disease": 1.6,
                        "bleeding": 1.4,
                        "thrombotic thrombocytopenic purpura": 1.2
                    },
                  
              
               
                    
                    "omeprazole": {
                        "gastroesophageal reflux disease": 1.25,
                        "peptic ulcer": 1.4,
                        "Zollinger-Ellison syndrome": 1.45,
                        "Clostridium difficile infection": 1.3,
                        "osteoporosis": 1.2,
                        "vitamin B12 deficiency": 1.1
                    },
                    "mesalamine": {
                        "ulcerative colitis": 1.4,
                        "Crohn's disease": 1.45,
                        "nephrotoxicity": 1.2,
                        "pancreatitis": 1.1
                    },
                
           
                    "montelukast": {
                        "asthma": 1.45,
                        "allergic rhinitis": 1.6,
                        "neuropsychiatric events": 1.2,
                        "Churg-Strauss syndrome": 1.1
                    },
                
                    
                    "sertraline": {
                        "major depressive disorder": 1.4,
                        "obsessive-compulsive disorder": 1.45,
                        "panic disorder": 1.6,
                        "post-traumatic stress disorder": 1.65,
                        "sexual dysfunction": 1.3,
                        "serotonin syndrome": 1.2
                    },
                    "quetiapine": {
                        "schizophrenia": 1.4,
                        "bipolar disorder": 1.45,
                        "major depressive disorder": 1.6,
                        "weight gain": 1.4,
                        "diabetes": 1.3,
                        "tardive dyskinesia": 1.2
                    },
                
                    
                    "levodopa": {
                        "Parkinson's disease": 1.2,
                        "restless legs syndrome": 1.4,
                        "dyskinesia": 1.4,
                        "hallucinations": 1.2
                    },
                    "topiramate": {
                        "epilepsy": 1.4,
                        "migraine prophylaxis": 1.45,
                        "cognitive impairment": 1.3,
                        "kidney stones": 1.2,
                        "glaucoma": 1.1
                    },
                
                    
                    "tamoxifen": {
                        "breast cancer": 1.2,
                        "ductal carcinoma in situ": 1.25,
                        "endometrial cancer": 1.4,
                        "thromboembolism": 1.3,
                        "cataracts": 1.2
                    },
                    "imatinib": {
                        "chronic myeloid leukemia": 1.2,
                        "gastrointestinal stromal tumors": 1.25,
                        "edema": 1.3,
                        "hepatotoxicity": 1.2
                    },
                
                    
                    "adalimumab": {
                        "rheumatoid arthritis": 1.25,
                        "psoriatic arthritis": 1.4,
                        "Crohn's disease": 1.45,
                        "ulcerative colitis": 1.6,
                        "tuberculosis reactivation": 1.4,
                        "lymphoma": 1.2,
                        "demyelinating disease": 1.1
                    },
                    "prednisone": {
                        "rheumatoid arthritis": 1.4,
                        "asthma": 1.45,
                        "inflammatory bowel disease": 1.6,
                        "multiple sclerosis": 1.65,
                        "osteoporosis": 1.5,
                        "diabetes": 1.4,
                        "adrenal insufficiency": 1.3,
                        "cataracts": 1.2
                    },
                
              

                    
                    "enoxaparin": {
                        "deep vein thrombosis": 1.4,
                        "pulmonary embolism": 1.45,
                        "acute coronary syndrome": 1.6,
                        "bleeding": 1.4,
                        "thrombocytopenia": 1.2
                    },
                    "filgrastim": {
                        "neutropenia": 1.4,
                        "bone marrow transplantation": 1.45,
                        "bone pain": 1.3,
                        "splenic rupture": 1.1
                    },
                
                    
                    "tacrolimus (topical)": {
                        "atopic dermatitis": 1.4,
                        "vitiligo": 1.45,
                        "skin cancer": 1.2,
                        "lymphoma": 1.1
                    },
                
                    
                    "latanoprost": {
                        "open-angle glaucoma": 1.4,
                        "ocular hypertension": 1.45,
                        "iris pigmentation changes": 1.3,
                        "eyelash changes": 1.2
                    },
                    "ranibizumab": {
                        "age-related macular degeneration": 1.4,
                        "diabetic macular edema": 1.45,
                        "retinal vein occlusion": 1.6,
                        "endophthalmitis": 1.3,
                        "stroke": 1.2
                    },
                
                    
                    "hydroxychloroquine": {
                        "rheumatoid arthritis": 1.4,
                        "systemic lupus erythematosus": 1.45,
                        "malaria": 1.6,
                        "retinopathy": 1.3,
                        "cardiomyopathy": 1.2
                    },
                    "colchicine": {
                        "gout": 1.4,
                        "familial Mediterranean fever": 1.45,
                        "pericarditis": 1.6,
                        "diarrhea": 1.4,
                        "bone marrow suppression": 1.2
                    },
                
               
                    "tamsulosin": {
                        "benign prostatic hyperplasia": 1.4,
                        "urinary retention": 1.45,
                        "orthostatic hypotension": 1.3,
                        "intraoperative floppy iris syndrome": 1.2
                    },
                
                    
                    "clomiphene": {
                        "ovulation induction": 1.4,
                        "male infertility": 1.45,
                        "ovarian hyperstimulation syndrome": 1.3,
                        "multiple pregnancies": 1.2
                    },
                
                    
                    "propofol": {
                        "general anesthesia": 1.4,
                        "sedation": 1.45,
                        "hypotension": 1.3,
                        "propofol infusion syndrome": 1.1
                    },
                    "ketamine": {
                        "anesthesia": 1.4,
                        "treatment-resistant depression": 1.45,
                        "dissociation": 1.3,
                        "cystitis": 1.2
                    },
                
                    
               
                    
                    "influenza vaccine": {
                        "influenza prevention": 1.2,
                        "Guillain-Barré syndrome": 1.1
                    },
                    "human papillomavirus vaccine": {
                        "cervical cancer prevention": 1.2,
                        "genital warts prevention": 1.25,
                        "syncope": 1.1
                    },
                
                    
                
                    "praziquantel": {
                        "schistosomiasis": 1.4,
                        "tapeworm infections": 1.45,
                        "neurocysticercosis": 1.6,
                        "dizziness": 1.2
                    },
           
                    
                    "naloxone": {
                        "opioid overdose": 1.2,
                        "opioid-induced respiratory depression": 1.25,
                        "acute opioid withdrawal": 1.3
                    },
                    "flumazenil": {
                        "benzodiazepine overdose": 1.2,
                        "hepatic encephalopathy": 1.25,
                        "seizures": 1.3,
                        "re-sedation": 1.2
                    },
                
                    
                    "meclizine": {
                        "motion sickness": 1.4,
                        "vertigo": 1.45,
                        "drowsiness": 1.3,
                        "dry mouth": 1.2
                    },
                    "betahistine": {
                        "Ménière's disease": 1.4,
                        "vertigo": 1.45,
                        "headache": 1.2
                    },
                
                    
                    "teriparatide": {
                        "osteoporosis": 1.4,
                        "glucocorticoid-induced osteoporosis": 1.45,
                        "osteosarcoma": 1.2,
                        "hypercalcemia": 1.1
                    },

                        "Antipsychotics": {
                            "weight gain": 1.2, 
                            "diabetes": 1.1, 
                            "dyslipidemia": 1.2, 
                            "cardiovascular disease": 1.1 
                        },
                        "Benzodiazepines": {
                            "dependence": 1.2, 
                            "withdrawal symptoms": 1.1, 
                            "cognitive impairment": 1.2, 
                            "falls": 1.1 
                        },
                        "Tricyclic Antidepressants (TCAs)": {
                            "suicidal thoughts": 1.2, 
                            "seizures": 1.1, 
                            "arrhythmias": 1.2, 
                            "anticholinergic effects": 1.1 
                        },
                        "Monoamine Oxidase Inhibitors (MAOIs)": {
                            "hypertensive crisis": 1.2, 
                            "serotonin syndrome": 1.1, 
                            "liver damage": 1.2, 
                            "weight gain": 1.1 
                        },
                        "Loop Diuretics": {
                            "hypokalemia": 1.2, 
                            "hyponatremia": 1.1, 
                            "ototoxicity": 1.2, 
                            "gout": 1.1 
                        },
                        "Thiazide Diuretics": {
                            "hypokalemia": 1.2, 
                            "hyperglycemia": 1.1, 
                            "hyperlipidemia": 1.2, 
                            "erectile dysfunction": 1.1 
                        },
                        "Potassium-Sparing Diuretics": {
                            "hyperkalemia": 1.2, 
                            "gynecomastia": 1.1, 
                            "impotence": 1.2, 
                            "diarrhea": 1.1 
                        },
                        "Alpha-Blockers": {
                            "orthostatic hypotension": 1.2, 
                            "dizziness": 1.1, 
                            "fatigue": 1.2, 
                            "nasal congestion": 1.1 
                        },
                        "Beta-2 Agonists": {
                            "tremors": 1.2, 
                            "anxiety": 1.1, 
                            "insomnia": 1.2, 
                            "palpitations": 1.1 
                        },
                        "Inhaled Corticosteroids": {
                            "oral thrush": 1.2, 
                            "hoarseness": 1.1, 
                            "candidiasis": 1.2, 
                            "adrenal insufficiency": 1.1 
                        },
                        "Leukotriene Modifiers": {
                            "Churg-Strauss syndrome": 1.2, 
                            "eosinophilic granuloma": 1.1, 
                            "hypereosinophilia": 1.2, 
                            "vasculitis": 1.1 
                        },
                            "escitalopram": { "major depressive disorder": 1.6, "generalized anxiety disorder": 1.45, "sexual dysfunction": 1.25, "hyponatremia": 1.1 },
                            "warfarin": { "atrial fibrillation": 1.4, "deep vein thrombosis": 1.45, "bleeding": 1.4, "osteoporosis": 1.1 },
                            "pregabalin": { "neuropathic pain": 1.6, "fibromyalgia": 1.45, "dizziness": 1.2, "weight gain": 1.15 },
                            "sitagliptin": { "type 2 diabetes": 1.6, "pancreatitis": 1.15, "joint pain": 1.1, "nasopharyngitis": 1.05 },
                            "rosuvastatin": { "high cholesterol": 1.4, "atherosclerosis": 1.45, "myopathy": 1.2, "liver damage": 1.15 },
                            "vortioxetine": { "major depressive disorder": 1.6, "nausea": 1.25, "sexual dysfunction": 1.15, "serotonin syndrome": 1.1 },
                            "apixaban": { "atrial fibrillation": 1.45, "deep vein thrombosis": 1.6, "bleeding": 1.3, "liver injury": 1.05 },
                        
                     
                            "Angiotensin Receptor Blockers (ARBs)": {
                                "dizziness": 1.2, 
                                "hypotension": 1.1, 
                                "hyperkalemia": 1.2, 
                                "cough": 1.1 
                            },
                         
                            "Direct Renin Inhibitors": {
                                "hyperkalemia": 1.2, 
                                "cough": 1.1, 
                                "dizziness": 1.2, 
                                "angioedema": 1.1 
                            },
                            "Beta-Blockers": {
                                "bradycardia": 1.2, 
                                "fatigue": 1.1, 
                                "dizziness": 1.2, 
                                "impotence": 1.1 
                            },
                            "Alpha-2 Agonists": {
                                "sedation": 1.2, 
                                "dizziness": 1.1, 
                                "dry mouth": 1.2, 
                                "constipation": 1.1 
                            },
                            "Cholinesterase Inhibitors": {
                                "nausea": 1.2, 
                                "vomiting": 1.1, 
                                "diarrhea": 1.2, 
                                "abdominal pain": 1.1 
                            },
                            "Muscle Relaxants": {
                                "drowsiness": 1.2, 
                                "dizziness": 1.1, 
                                "headache": 1.2, 
                                "nausea": 1.1 
                            },
                            "Anticholinergics": {
                                "dry mouth": 1.2, 
                                "constipation": 1.1, 
                                "urinary retention": 1.2, 
                                "blurred vision": 1.1 
                            },
                            "Cyclophosphamide": {
                                "neutropenia": 1.2, 
                                "anemia": 1.1, 
                                "thrombocytopenia": 1.2, 
                                "hemorrhagic cystitis": 1.1 
                            },
                          
                            "Azathioprine": {
                                "neutropenia": 1.2, 
                                "anemia": 1.1, 
                                "thrombocytopenia": 1.2, 
                                "liver toxicity": 1.1 
                            },
                                
                                "dicyclomine": {
                                    "irritable bowel syndrome": 1.4,
                                    "abdominal cramps": 1.45,
                                    "urinary retention": 1.3,
                                    "blurred vision": 1.2
                                },
                                
                              
                             
                                "doxycycline": {
                                    "malaria": 1.6,
                                    "lyme disease": 1.2,
                                    "acne": 1,
                                    "photosensitivity": 1.4,
                                    "gastrointestinal issues": 1.2
                                },
                                
                      
                                
                                "ibuprofen": {
                                    "pain relief": 1,
                                    "fever": 1.2,
                                    "inflammation": 1.2,
                                    "gastrointestinal bleeding": 1.4,
                                    "renal dysfunction": 1.3
                                },
                                "naproxen": {
                                    "pain relief": 1,
                                    "inflammation": 1.2,
                                    "headache": 1.1,
                                    "gastrointestinal bleeding": 1.4,
                                    "heartburn": 1.2
                                },
                                
                                
                                "morphine": {
                                    "severe pain": 0.3,
                                    "respiratory depression": 1.6,
                                    "constipation": 1.4,
                                    "nausea": 1.2,
                                    "sedation": 1.3
                                },
                                "fentanyl": {
                                    "severe pain": 0.2,
                                    "respiratory depression": 1.8,
                                    "constipation": 1.5,
                                    "nausea": 1.3,
                                    "sedation": 1.4
                                },
                                "penicillin": {
                                    "urticaria": 1.7,
                                    "joint pain": 1.5,
                                    "diarrhoea": 1.3,
                                    "rashes": 1.6,
                                    "anaphylaxis": 1.6
                                },

                            
                                
                      
                                "diphenhydramine": {
                                    "allergic reaction": 1,
                                    "motion sickness": 1.2,
                                    "drowsiness": 1.5,
                                    "dry mouth": 1.3,
                                    "confusion": 1.4
                                },
                                
                              
                                "pantoprazole": {
                                    "GERD": 0.4,
                                    "peptic ulcer": 1,
                                    "headache": 1.2,
                                    "nausea": 1.2,
                                    "bone fractures": 1.5
                                },
                                
                          
                                
                                
                                "haloperidol": {
                                    "schizophrenia": 0.4,
                                    "psychosis": 0.4,
                                    "tardive dyskinesia": 1.5,
                                    "akathisia": 1.4,
                                    "sedation": 1.2
                                },
                          
                                "insulin": {
                                    "type 1 diabetes": 0.2,
                                    "type 2 diabetes": 0.3,
                                    "hypoglycemia": 1.8,
                                    "weight gain": 1.3,
                                    "lipodystrophy": 1.4
                                },
                                
                             
                                "spironolactone": {
                                    "heart failure": 1,
                                    "hypertension": 1.2,
                                    "hyperkalemia": 1.6,
                                    "gynecomastia": 1.4,
                                    "nausea": 1.2
                                },
                                
                                
                             
                                "dexamethasone": {
                                    "cerebral edema": 0.4,
                                    "allergic reaction": 1,
                                    "hyperglycemia": 1.4,
                                    "osteoporosis": 1.5,
                                    "insomnia": 1.2
                                },
                                
                              
                                "heparin": {
                                    "deep vein thrombosis": 0.3,
                                    "pulmonary embolism": 0.3,
                                    "thrombocytopenia": 1.6,
                                    "bleeding": 1.7
                                },
                                
                                
                              
                                "propranolol": {
                                    "hypertension": 0.4,
                                    "migraine": 1,
                                    "bradycardia": 1.3,
                                    "fatigue": 1.2,
                                    "dizziness": 1.1
                                },
                                
                           
                                "simvastatin": {
                                    "hyperlipidemia": 0.3,
                                    "cardiovascular disease": 0.4,
                                    "muscle pain": 1.3,
                                    "liver toxicity": 1.4,
                                    "nausea": 1.2
                                },
                                
                               
                                "methimazole": {
                                    "hyperthyroidism": 0.3,
                                    "agranulocytosis": 1.6,
                                    "rash": 1.3,
                                    "hepatotoxicity": 1.5
                                },
                                

                                
                                    "alendronate": { "osteoporosis": 1.25, "esophageal irritation": 1.1, "atypical femur fracture": 1.15, "jaw osteonecrosis": 1.05 },
                                    "lisinopril": { "hypertension": 1.45, "angioedema": 1.2, "hyperkalemia": 1.15, "cough": 1.4 },
                                    "gabapentin": { "epilepsy": 1.4, "neuropathic pain": 1.45, "dizziness": 1.3, "weight gain": 1.2 },
                                    "methotrexate": { "rheumatoid arthritis": 1.45, "psoriasis": 1.6, "liver toxicity": 1.3, "bone marrow suppression": 1.25 },
                                    "hydrocodone": { "severe pain": 1.65, "cough suppression": 1.6, "constipation": 1.3, "respiratory depression": 1.4 },
                                    "losartan": { "hypertension": 1.45, "diabetic nephropathy": 1.6, "hyperkalemia": 1.15, "dizziness": 1.1 },
                                    "insulin glargine": { "type 1 diabetes": 1.65, "type 2 diabetes": 1.6, "hypoglycemia": 1.3, "weight gain": 1.2 },
                                    "duloxetine": { "major depressive disorder": 1.45, "generalized anxiety disorder": 1.6, "nausea": 1.2, "sexual dysfunction": 1.25 },
                                    "venlafaxine": { "major depressive disorder": 1.45, "generalized anxiety disorder": 1.6, "hypertension": 1.2, "withdrawal symptoms": 1.3 },
                                    "empagliflozin": { "type 2 diabetes": 1.6, "heart failure": 1.45, "urinary tract infections": 1.2, "diabetic ketoacidosis": 1.15 },
                                    "tofacitinib": { "rheumatoid arthritis": 1.45, "ulcerative colitis": 1.6, "infections": 1.3, "malignancy": 1.1 },
                                    "albendazole": { "intestinal worms": 1.6, "nausea": 1.15, "abdominal pain": 1.1, "dizziness": 1.05 },
                                    "metoclopramide": { "nausea": 1.45, "vomiting": 1.6, "extrapyramidal symptoms": 1.3, "tardive dyskinesia": 1.2 },
                                    "zinc_sulfate": { "diarrhea in children": 1.45, "common cold": 1.4, "nausea": 1.15, "abdominal cramps": 1.1 },
                                    "cotrimoxazole": { "pneumocystis pneumonia": 1.6, "urinary tract infections": 1.45, "rash": 1.2, "bone marrow suppression": 1.15 },
                                    "misoprostol": { "postpartum hemorrhage": 1.45, "gastric ulcers": 1.6, "diarrhea": 1.3, "abdominal pain": 1.2 },
                                    "diethylcarbamazine": { "lymphatic filariasis": 1.6, "loiasis": 1.45, "fever": 1.2, "headache": 1.15 },
                                    "artesunate": { "severe malaria": 1.65, "neutropenia": 1.2, "anemia": 1.15, "hepatotoxicity": 1.1 },
                                    "rifampicin": { "tuberculosis": 1.45, "leprosy": 1.6, "hepatotoxicity": 1.3, "drug interactions": 1.25 },
                                    "mebendazole": { "intestinal worms": 1.6, "abdominal pain": 1.15, "diarrhea": 1.1, "dizziness": 1.05 },
                                    "fluconazole": { "fungal infections": 1.6, "cryptococcal meningitis": 1.45, "nausea": 1.15, "hepatotoxicity": 1.2 },
                                    "ampicillin": { "bacterial infections": 1.6, "colitis": 1.6, "urticaria": 1.1, "rash": 1.2, "diarrhea": 1.15, "nausea": 1.1 },
                                    "diazepam": { "anxiety": 1.45, "alcohol withdrawal": 1.6, "drowsiness": 1.3, "dependence": 1.25 },
                                    "gentamicin": { "gram-negative bacterial infections": 1.6, "nephrotoxicity": 1.3, "ototoxicity": 1.25, "neuromuscular blockade": 1.2 },
                                    "oxytocin": { "labor induction": 1.6, "postpartum hemorrhage": 1.45, "water intoxication": 1.2, "hypotension": 1.15 },
                                    "folic_acid": { "anemia": 1.45, "neural tube defects prevention": 1.4, "gastrointestinal upset": 1.1, "zinc deficiency": 1.05 },
                                    "metformin": { "type 2 diabetes": 1.6, "polycystic ovary syndrome": 1.45, "lactic acidosis": 1.2, "vitamin B12 deficiency": 1.15 },
                                    "carbamazepine": { "epilepsy": 1.6, "trigeminal neuralgia": 1.45, "Stevens-Johnson syndrome": 1.3, "hyponatremia": 1.2 },
                                    "diclofenac": { "pain": 1.45, "inflammation": 1.6, "gastrointestinal bleeding": 1.3, "cardiovascular events": 1.25 },
                                    "ferrous_sulfate": { "iron deficiency anemia": 1.6, "constipation": 1.2, "nausea": 1.15, "abdominal pain": 1.1 },
                          
                            
                        
                            "Antiretrovirals (ARVs)": {
                                "lactic acidosis": 1.2, 
                                "hepatotoxicity": 1.1, 
                                "lipodystrophy": 1.2, 
                                "insulin resistance": 1.1 
                            },
                            "Antimalarials": {
                                "hemolytic anemia": 1.2, 
                                "neutropenia": 1.1, 
                                "thrombocytopenia": 1.2, 
                                "hepatotoxicity": 1.1 
                            },
                            "Isoniazid": {
                                "hepatotoxicity": 1.2, 
                                "peripheral neuropathy": 1.1, 
                                "seizures": 1.2, 
                                "psychosis": 1.1 
                            },
                           
                            "Ethambutol": {
                                "optic neuritis": 1.2, 
                                "peripheral neuropathy": 1.1, 
                                "nephrotoxicity": 1.2, 
                                "hepatotoxicity": 1.1 
                            },
                            "Pyrazinamide": {
                                "hepatotoxicity": 1.2, 
                                "arthralgia": 1.1, 
                                "gout": 1.2, 
                                "hyperuricemia": 1.1 
                            },
                       
                            "Ciprofloxacin": {
                                "tendinitis": 1.2, 
                                "tendon rupture": 1.1, 
                                "QT prolongation": 1.2, 
                                "seizures": 1.1 
                            },
                            "Metronidazole": {
                                "peripheral neuropathy": 1.2, 
                                "seizures": 1.1, 
                                "encephalopathy": 1.2, 
                                "hepatotoxicity": 1.1 
                            },
                         
                          
                            
                                "abacavir": { "HIV": 1.6, "hypersensitivity reaction": 1.3, "lactic acidosis": 1.2, "lipodystrophy": 1.1 },
                                "acyclovir": { "herpes simplex": 1.45, "varicella zoster": 1.6, "nephrotoxicity": 1.2, "neurotoxicity": 1.15 },
                                "amodiaquine": { "malaria": 1.6, "agranulocytosis": 1.3, "hepatotoxicity": 1.25, "nausea": 1.1 },
                                "amoxicillin_clavulanate": { "vaginitis": 1.8, "gastritis": 1.2, "hepatotoxicity": 1.15, "rash": 1.1 },
                                "amphotericin_b": { "fungal infections": 1.65, "nephrotoxicity": 1.3, "hypokalemia": 1.25, "infusion reactions": 1.2 },
                                "atropine": { "bradycardia": 1.45, "organophosphate poisoning": 1.6, "dry mouth": 1.2, "urinary retention": 1.15 },
                                "baclofen": { "muscle spasticity": 1.45, "drowsiness": 1.2, "dizziness": 1.15, "withdrawal syndrome": 1.3 },
                                "bedaquiline": { "multidrug-resistant tuberculosis": 1.65, "QT prolongation": 1.3, "hepatotoxicity": 1.2, "pancreatitis": 1.15 },
                                "benzyl penicillin": {"angioedema": 1.1},
                                "benzathine_penicillin": { "syphilis": 1.65, "thrombocytopenia": 1.6, "rheumatic fever prophylaxis": 1.6, "anaphylaxis": 1.3, "Jarisch-Herxheimer reaction": 1.2 },
                                "bismuth_subsalicylate": { "diarrhea": 1.45, "H. pylori infection": 1.6, "black stool": 1.1, "tinnitus": 1.05 },
                                "cefixime": { "gonorrhea": 1.65, "urinary tract infections": 1.6, "diarrhea": 1.15, "pseudomembranous colitis": 1.1 },
                                "ceftazidime": { "pseudomonas infections": 1.65, "meningitis": 1.6, "seizures": 1.2, "neutropenia": 1.15 },
                                "chloramphenicol": { "typhoid fever": 1.65, "meningitis": 1.6, "bone marrow suppression": 1.3, "gray baby syndrome": 1.25 },
                                "clofazimine": { "leprosy": 1.65, "skin discoloration": 1.3, "gastrointestinal disturbances": 1.2, "QT prolongation": 1.15 },
                                "cloxacillin": { "staphylococcal infections": 1.65, "candidiasis": 1.8, "hepatitis": 1.2, "neutropenia": 1.15, "interstitial nephritis": 1.1 },
                                "cycloserine": { "multidrug-resistant tuberculosis": 1.6, "psychosis": 1.3, "seizures": 1.25, "peripheral neuropathy": 1.2 },
                                "dapsone": { "leprosy": 1.65, "pneumocystis pneumonia": 1.6, "hemolytic anemia": 1.3, "methemoglobinemia": 1.25 },
                                "delamanid": { "multidrug-resistant tuberculosis": 1.65, "QT prolongation": 1.3, "hepatotoxicity": 1.2, "hypokalemia": 1.15 },
                                "dihydroartemisinin_piperaquine": { "malaria": 1.65, "QT prolongation": 1.2, "hepatotoxicity": 1.15, "gastrointestinal disturbances": 1.1 },
                                "diloxanide": { "amoebiasis": 1.6, "flatulence": 1.15, "nausea": 1.1, "pruritus": 1.05 },
                                "domperidone": { "nausea": 1.45, "vomiting": 1.6, "QT prolongation": 1.3, "galactorrhea": 1.2 },
                                "eflornithine": { "African trypanosomiasis": 1.65, "seizures": 1.2, "bone marrow suppression": 1.15, "alopecia": 1.1 },
                                "etravirine": { "HIV": 1.6, "rash": 1.2, "hepatotoxicity": 1.15, "nausea": 1.1 },
                                "fexinidazole": { "African trypanosomiasis": 1.65, "nausea": 1.2, "vomiting": 1.15, "headache": 1.1 },
                                "flucytosine": { "cryptococcal meningitis": 1.65, "bone marrow suppression": 1.3, "hepatotoxicity": 1.2, "cardiotoxicity": 1.15 },
                                "flucloxacillin": {"urticaria": 1.1, "skin rash": 2, "diarrhoea": 1.6 },
                                "gatifloxacin": { "bacterial infections": 1.6, "dysglycemia": 1.3, "QT prolongation": 1.2, "tendinitis": 1.15 },
                                "halofantrine": { "malaria": 1.6, "QT prolongation": 1.3, "cardiovascular events": 1.25, "gastrointestinal disturbances": 1.1 },
                                "kanamycin": { "multidrug-resistant tuberculosis": 1.65, "ototoxicity": 1.3, "nephrotoxicity": 1.25, "neuromuscular blockade": 1.2 },
                                "lefamulin": { "community-acquired bacterial pneumonia": 1.65, "diarrhea": 1.2, "QT prolongation": 1.15, "hepatotoxicity": 1.1 },
                                "linagliptin": { "type 2 diabetes": 1.6, "pancreatitis": 1.2, "hypersensitivity reactions": 1.15, "arthralgia": 1.1 },
                                "linezolid": { "multidrug-resistant tuberculosis": 1.65, "thrombocytopenia": 1.3, "peripheral neuropathy": 1.25, "lactic acidosis": 1.2 },
                                "loperamide": { "diarrhea": 1.45, "constipation": 1.2, "paralytic ileus": 1.15, "toxic megacolon": 1.1 },
                                "cephalexin": { "vaginal candidiasis": 1.8, "pruritus": 1.1 },
                                "melarsoprol": { "African trypanosomiasis": 1.65, "encephalopathy": 1.3, "peripheral neuropathy": 1.25, "cardiac arrhythmias": 1.2 },
                                "moxifloxacin": { "multidrug-resistant tuberculosis": 1.65, "QT prolongation": 1.3, "tendinitis": 1.2, "dysglycemia": 1.15 },
                                "nitazoxanide": { "cryptosporidiosis": 1.6, "giardiasis": 1.45, "abdominal pain": 1.15, "diarrhea": 1.1 },
                                "oxamniquine": { "schistosomiasis": 1.65, "seizures": 1.2, "dizziness": 1.15, "hepatotoxicity": 1.1 },
                                "pentamidine": { "pneumocystis pneumonia": 1.65, "hypoglycemia": 1.3, "nephrotoxicity": 1.25, "pancreatitis": 1.2 },
                                "pentavalent_antimonials": { "leishmaniasis": 1.65, "cardiotoxicity": 1.3, "hepatotoxicity": 1.25, "pancreatitis": 1.2 },
                                "phenoxymethylpenicillin": { "streptococcal infections": 1.6, "rheumatic fever prophylaxis": 1.45, "anaphylaxis": 1.3, "diarrhea": 1.15 },
                                "posaconazole": { "fungal infections": 1.65, "QT prolongation": 1.2, "hepatotoxicity": 1.15, "hypokalemia": 1.1 },
                                "primaquine": { "malaria": 1.6, "hemolytic anemia": 1.3, "methemoglobinemia": 1.2, "gastrointestinal disturbances": 1.15 },
                                "proguanil": { "malaria prophylaxis": 1.45, "mouth ulcers": 1.15, "hair loss": 1.1, "gastrointestinal disturbances": 1.05 },
                                "pyrantel": { "intestinal worms": 1.6, "abdominal pain": 1.15, "diarrhea": 1.1, "dizziness": 1.05 },
                                "pyrimethamine": { "malaria": 1.45, "toxoplasmosis": 1.6, "megaloblastic anemia": 1.2, "rash": 1.15 },
                                "raltegravir": { "HIV": 1.65, "myopathy": 1.2, "rash": 1.15, "insomnia": 1.1 },
                                "rifapentine": { "latent tuberculosis": 1.65, "hepatotoxicity": 1.2, "hypersensitivity reactions": 1.15, "orange discoloration of body fluids": 1.1 },
                                "secnidazole": { "amoebiasis": 1.6, "trichomoniasis": 1.45, "metallic taste": 1.15, "nausea": 1.1 },
                                "sodium_stibogluconate": { "leishmaniasis": 1.65, "cardiotoxicity": 1.3, "pancreatitis": 1.25, "hepatotoxicity": 1.2 },
                                "spiramycin": { "toxoplasmosis": 1.6, "gastrointestinal disturbances": 1.15, "rash": 1.1, "eosinophilia": 1.05 },
                                "stavudine": { "HIV": 1.6, "peripheral neuropathy": 1.3, "lactic acidosis": 1.25, "lipodystrophy": 1.2 },
                                "streptomycin": { "tuberculosis": 1.65, "ototoxicity": 1.3, "nephrotoxicity": 1.25, "neuromuscular blockade": 1.2 },
                                "sulfadoxine_pyrimethamine": { "malaria": 1.6, "severe cutaneous reactions": 1.3, "megaloblastic anemia": 1.2, "crystalluria": 1.15 },
                                "suramin": { "African trypanosomiasis": 1.65, "nephrotoxicity": 1.3, "peripheral neuropathy": 1.25, "severe allergic reactions": 1.2 },
                                "telithromycin": { "community-acquired pneumonia": 1.65, "hepatotoxicity": 1.3, "visual disturbances": 1.2, "QT prolongation": 1.15 },
                                "tenofovir_alafenamide": { "HIV": 1.65, "hepatitis B": 1.6, "renal impairment": 1.15, "decreased bone density": 1.1 },
                            "Sulfadoxine-Pyrimethamine": {
                                "hemolytic anemia": 1.2, 
                                "neutropenia": 1.1, 
                                "thrombocytopenia": 1.2, 
                                "hepatotoxicity": 1.1 
                            },
                            "Amodiaquine": {
                                "neutropenia": 1.2, 
                                "thrombocytopenia": 1.1, 
                                "hepatotoxicity": 1.2, 
                                "agranulocytosis": 1.1 
                            },
                            "Artemether-Lumefantrine": {
                                "neutropenia": 1.2, 
                                "thrombocytopenia": 1.1, 
                                "hepatotoxicity": 1.2, 
                                "QT prolongation": 1.1 
                            },
                            "Dihydroartemisinin-Piperaquine": {
                                "neutropenia": 1.2, 
                                "thrombocytopenia": 1.1, 
                                "hepatotoxicity": 1.2, 
                                "QT prolongation": 1.1 
                            },
                           
                        
                            "Primaquine": {
                                "hemolytic anemia": 1.2, 
                                "methemoglobinemia": 1.1, 
                                "neutropenia": 1.2, 
                                "thrombocytopenia": 1.1 
                            },
                            "Tetracycline": {
                                "phototoxicity": 1.2, 
                                "hepatotoxicity": 1.1, 
                                "esophagitis": 1.2, 
                                "pseudotumor cerebri": 1.1 
                            },
                            
                                "quinine": {
                                    "malaria": 0.3,
                                    "cinchonism": 1.5,
                                    "hypoglycemia": 1.4,
                                    "tinnitus": 1.3
                                },
                                "sulfadoxine-pyrimethamine": {
                                    "malaria": 0.3,
                                    "anemia": 1.4,
                                    "skin rash": 1.3,
                                    "nausea": 1.2
                                },
                                
                            
                            
                                "ethambutol": {
                                    "tuberculosis": 0.3,
                                    "optic neuritis": 1.5,
                                    "gout": 1.2,
                                    "nausea": 1.1
                                },
                                "pyrazinamide": {
                                    "tuberculosis": 0.3,
                                    "hepatotoxicity": 1.5,
                                    "joint pain": 1.3,
                                    "gout": 1.3
                                },
                            
                              
                            
                                "lamivudine": {
                                    "HIV/AIDS": 0.3,
                                    "pancreatitis": 1.4,
                                    "fatigue": 1.3,
                                    "headache": 1.2
                                },
                                "dolutegravir": {
                                    "HIV/AIDS": 0.2,
                                    "insomnia": 1.3,
                                    "weight gain": 1.4,
                                    "headache": 1.2
                                },
                            
                          
                            
                         
                                "ors (oral rehydration solution)": {
                                    "dehydration": 0.2,
                                    "diarrhea": 0.3,
                                    "nausea": 1.1,
                                    "abdominal distension": 1.2
                                },

                                "griseofulvin": {
                                    "tinea infections": 0.4,
                                    "headache": 1.2,
                                    "nausea": 1.3,
                                    "photosensitivity": 1.4,
                                    "fatigue": 1.3
                                },
                            
                                
                                "paracetamol": {
                                    "fever": 0.4,
                                    "pain relief": 1,
                                    "liver toxicity": 1.5,
                                    "nausea": 1.2,
                                    "rash": 1.2
                                },
                                "aspirin": {
                                    "pain relief": 0.4,
                                    "fever": 1,
                                    "gastrointestinal bleeding": 1.5,
                                    "bruising": 1.3,
                                    "rash": 1.2
                                },
                            
                                
                                "hydrochlorothiazide": {
                                    "hypertension": 0.3,
                                    "heart failure": 0.4,
                                    "electrolyte imbalance": 1.4,
                                    "dehydration": 1.3,
                                    "dizziness": 1.2
                                },
                                "enalapril": {
                                    "hypertension": 0.3,
                                    "heart failure": 0.4,
                                    "cough": 1.3,
                                    "angioedema": 1.4,
                                    "hyperkalemia": 1.5
                                },
                            
                                
                                "chlorpheniramine": {
                                    "allergic reactions": 0.4,
                                    "urticaria": 1,
                                    "drowsiness": 1.3,
                                    "dry mouth": 1.2,
                                    "blurred vision": 1.1
                                },
                                "promethazine": {
                                    "allergic reactions": 0.4,
                                    "motion sickness": 1,
                                    "sedation": 1.4,
                                    "dry mouth": 1.3,
                                    "drowsiness": 1.2
                                },
                            
                            
                               
                                
                                "glibenclamide": {
                                    "type 2 diabetes": 0.3,
                                    "hypoglycemia": 1.6,
                                    "weight gain": 1.3,
                                    "nausea": 1.2
                                },
                             
                            
                                
                          
                            
                                
                                "furosemide": {
                                    "heart failure": 0.4,
                                    "hypertension": 1,
                                    "edema": 0.4,
                                    "hypokalemia": 1.5,
                                    "dehydration": 1.4
                                },
                         
                              
                            
                                    "abarelix": { "prostate cancer": 1.6, "hot flashes": 1.2, "osteoporosis": 1.15, "anaphylaxis": 1.1 },
                                    "abatacept": { "rheumatoid arthritis": 1.65, "increased infections": 1.2, "headache": 1.15, "nausea": 1.1 },
                                    "acarbose": { "type 2 diabetes": 1.6, "flatulence": 1.2, "diarrhea": 1.15, "elevated liver enzymes": 1.1 },
                                    "acebutolol": { "hypertension": 1.6, "arrhythmias": 1.45, "bronchospasm": 1.2, "fatigue": 1.15 },
                                    "acetazolamide": { "glaucoma": 1.6, "altitude sickness": 1.45, "metabolic acidosis": 1.2, "kidney stones": 1.15 },
                                    "acetylcysteine": { "acetaminophen overdose": 1.65, "bronchitis": 1.6, "anaphylactoid reactions": 1.2, "nausea": 1.15 },
                                    "adapalene": { "acne": 1.6, "skin irritation": 1.2, "dryness": 1.15, "erythema": 1.1 },
                                    "adefovir": { "hepatitis B": 1.65, "nephrotoxicity": 1.2, "lactic acidosis": 1.15, "osteomalacia": 1.1 },
                                    "adenosine": { "paroxysmal supraventricular tachycardia": 1.65, "chest pain": 1.2, "dyspnea": 1.15, "flushing": 1.1 },
                                    "agalsidase_beta": { "Fabry disease": 1.65, "infusion reactions": 1.2, "antibody formation": 1.15, "fever": 1.1 },
                                    "albuterol": { "asthma": 1.65, "COPD": 1.6, "tachycardia": 1.2, "tremor": 1.15 },
                                    "alfuzosin": { "benign prostatic hyperplasia": 1.65, "orthostatic hypotension": 1.2, "dizziness": 1.15, "headache": 1.1 },
                                    "aliskiren": { "hypertension": 1.65, "hyperkalemia": 1.2, "angioedema": 1.15, "diarrhea": 1.1 },
                                    "almotriptan": { "migraine": 1.65, "chest tightness": 1.2, "paresthesia": 1.15, "dizziness": 1.1 },
                                    "alosetron": { "irritable bowel syndrome": 1.65, "constipation": 1.2, "ischemic colitis": 1.15, "abdominal pain": 1.1 },
                                    "alteplase": { "acute ischemic stroke": 1.65, "myocardial infarction": 1.6, "intracranial hemorrhage": 1.3, "anaphylaxis": 1.2 },
                                    "amantadine": { "influenza A": 1.6, "Parkinson's disease": 1.45, "hallucinations": 1.2, "peripheral edema": 1.15 },
                                    "ambrisentan": { "pulmonary arterial hypertension": 1.65, "peripheral edema": 1.2, "nasal congestion": 1.15, "hepatotoxicity": 1.1 },
                                    "amifostine": { "renal toxicity from cisplatin": 1.65, "hypotension": 1.2, "nausea": 1.15, "hypocalcemia": 1.1 },
                                    "amiloride": { "hypertension": 1.6, "congestive heart failure": 1.45, "hyperkalemia": 1.2, "gynecomastia": 1.15 },
                                    "aminocaproic_acid": { "excessive bleeding": 1.65, "thrombosis": 1.2, "myopathy": 1.15, "gastrointestinal upset": 1.1 },
                                    "amiodarone": { "ventricular arrhythmias": 1.65, "thyroid dysfunction": 1.2, "pulmonary toxicity": 1.15, "hepatotoxicity": 1.1 },
                                    "amoxapine": { "depression": 1.65, "anxiety": 1.6, "anticholinergic effects": 1.2, "weight gain": 1.15 },
                                    "amphetamine": { "attention deficit hyperactivity disorder": 1.65, "narcolepsy": 1.6, "addiction": 1.3, "cardiovascular events": 1.2 },
                                    "anagrelide": { "essential thrombocythemia": 1.65, "headache": 1.2, "palpitations": 1.15, "anemia": 1.1 },
                                    "anakinra": { "rheumatoid arthritis": 1.65, "neonatal-onset multisystem inflammatory disease": 1.6, "injection site reactions": 1.2, "increased infections": 1.15 },
                                    "anastrozole": { "breast cancer": 1.65, "hot flashes": 1.2, "arthralgia": 1.15, "osteoporosis": 1.1 },
                                    "anidulafungin": { "candidiasis": 1.65, "hepatotoxicity": 1.2, "histamine-related reactions": 1.15, "rash": 1.1 },
                                    "apremilast": { "psoriatic arthritis": 1.65, "plaque psoriasis": 1.6, "diarrhea": 1.2, "depression": 1.15 },
                                    "argatroban": { "heparin-induced thrombocytopenia": 1.65, "bleeding": 1.2, "hepatic impairment": 1.15, "hypersensitivity reactions": 1.1 },
                                    "aripiprazole": { "schizophrenia": 1.65, "bipolar disorder": 1.6, "akathisia": 1.2, "weight gain": 1.15 },
                                    "armodafinil": { "narcolepsy": 1.65, "obstructive sleep apnea": 1.6, "insomnia": 1.2, "anxiety": 1.15 },
                                    "arsenic_trioxide": { "acute promyelocytic leukemia": 1.65, "QT prolongation": 1.2, "differentiation syndrome": 1.15, "hepatotoxicity": 1.1 },
                                    "artemether": { "malaria": 1.65, "neurotoxicity": 1.2, "QT prolongation": 1.15, "hepatotoxicity": 1.1 },
                                    "asenapine": { "schizophrenia": 1.65, "bipolar disorder": 1.6, "weight gain": 1.2, "extrapyramidal symptoms": 1.15 },
                                    "atazanavir": { "HIV": 1.65, "hyperbilirubinemia": 1.2, "nephrolithiasis": 1.15, "PR interval prolongation": 1.1 },
                                    "atomoxetine": { "attention deficit hyperactivity disorder": 1.65, "suicidal ideation": 1.2, "hepatotoxicity": 1.15, "growth suppression": 1.1 },
                                    "atovaquone": { "pneumocystis pneumonia": 1.65, "toxoplasmosis": 1.6, "rash": 1.2, "gastrointestinal disturbances": 1.15 },
                                    "axitinib": { "renal cell carcinoma": 1.65, "hypertension": 1.2, "proteinuria": 1.15, "thyroid dysfunction": 1.1 },
                                    "azacitidine": { "myelodysplastic syndromes": 1.65, "neutropenia": 1.2, "thrombocytopenia": 1.15, "hepatotoxicity": 1.1 },
                                    "azathioprine": { "rheumatoid arthritis": 1.65, "organ transplant rejection": 1.6, "bone marrow suppression": 1.2, "hepatotoxicity": 1.15 },
                                    "azelaic_acid": { "acne": 1.65, "rosacea": 1.6, "skin irritation": 1.2, "hypopigmentation": 1.15 },
                                    "bacitracin": { "skin infections": 1.65, "nephrotoxicity": 1.2, "anaphylaxis": 1.15, "contact dermatitis": 1.1 },
                                    "balsalazide": { "ulcerative colitis": 1.65, "headache": 1.2, "abdominal pain": 1.15, "exacerbation of colitis": 1.1 },
                                    "basiliximab": { "organ transplant rejection": 1.65, "hypersensitivity reactions": 1.2, "increased infections": 1.15, "lymphoma": 1.1 },
                                    "benazepril": { "hypertension": 1.65, "congestive heart failure": 1.6, "angioedema": 1.2, "hyperkalemia": 1.15 },
                                    "bendamustine": { "chronic lymphocytic leukemia": 1.65, "non-Hodgkin's lymphoma": 1.6, "myelosuppression": 1.2, "infections": 1.15 },
                                    "benzonatate": { "cough": 1.65, "hypersensitivity reactions": 1.2, "chest tightness": 1.15, "dizziness": 1.1 },
                                    "benztropine": { "Parkinson's disease": 1.65, "drug-induced extrapyramidal symptoms": 1.6, "anticholinergic effects": 1.2, "cognitive impairment": 1.15 },
                                    "bepridil": { "chronic stable angina": 1.65, "QT prolongation": 1.2, "ventricular arrhythmias": 1.15, "hepatotoxicity": 1.1 },
                                    "betamethasone": { "inflammatory conditions": 1.65, "adrenal suppression": 1.2, "osteoporosis": 1.15, "hyperglycemia": 1.1 },
                                    "betaxolol": { "hypertension": 1.65, "glaucoma": 1.6, "bronchospasm": 1.2, "bradycardia": 1.15 },
                                    "bethanechol": { "urinary retention": 1.65, "neurogenic bladder": 1.6, "gastrointestinal disturbances": 1.2, "bronchospasm": 1.15 },
                                    "bexarotene": { "cutaneous T-cell lymphoma": 1.65, "hyperlipidemia": 1.2, "hypothyroidism": 1.15, "pancreatitis": 1.1 },
                                    "bezafibrate": { "hyperlipidemia": 1.65, "myopathy": 1.2, "cholelithiasis": 1.15, "hepatotoxicity": 1.1 },
                                    "bicalutamide": { "prostate cancer": 1.65, "gynecomastia": 1.2, "hepatotoxicity": 1.15, "hot flashes": 1.1 },
                                    "bilastine": { "allergic rhinitis": 1.65, "urticaria": 1.6, "sedation": 1.15, "QT prolongation": 1.1 },
                                
                                    
                                
                                    "Minocycline": {
                                        "pseudotumor cerebri": 1.2, 
                                        "hepatotoxicity": 1.1, 
                                        "esophagitis": 1.2, 
                                        "autoimmune disorders": 1.1 
                                    },
                                  
                                    "Norfloxacin": {
                                        "tendinitis": 1.2, 
                                        "tendon rupture": 1.1, 
                                        "QT prolongation": 1.2, 
                                        "seizures": 1.1 
                                    },
                                    "Ofloxacin": {
                                        "tendinitis": 1.2, 
                                        "tendon rupture": 1.1, 
                                        "QT prolongation": 1.2, 
                                        "seizures": 1.1 
                                    },
                                    "Levofloxacin": {
                                        "tendinitis": 1.2, 
                                        "tendon rupture": 1.1, 
                                        "QT prolongation": 1.2, 
                                        "seizures": 1.1 
                                    },
                                    "Moxifloxacin": {
                                        "tendinitis": 1.2, 
                                        "tendon rupture": 1.1, 
                                        "QT prolongation": 1.2, 
                                        "seizures": 1.1 
                                    },
                                    "Gatifloxacin": {
                                        "tendinitis": 1.2, 
                                        "tendon rupture": 1.1, 
                                        "QT prolongation": 1.2, 
                                        "seizures": 1.1 
                                    },
                                    "Gemifloxacin": {
                                        "tendinitis": 1.2, 
                                        "tendon rupture": 1.1, 
                                        "QT prolongation": 1.2, 
                                        "seizures": 1.1 
                                    },
                                   
                                    "Clarithromycin": {
                                        "hepatotoxicity": 1.2, 
                                        "QT prolongation": 1.1, 
                                        "cardiac arrhythmias": 1.2, 
                                        "allergic reactions": 1.1 
                                    },
                                    "Erythromycin": {
                                        "hepatotoxicity": 1.2, 
                                        "QT prolongation": 1.1, 
                                        "cardiac arrhythmias": 1.2, 
                                        "allergic reactions": 1.1 
                                    },
                                    
                                        
                                  
                                       
                                        "ceftriaxone": {
                                            "pneumonia": 0.3,
                                            "gonorrhea": 0.4,
                                            "bacterial meningitis": 0.3,
                                            "rash": 1.2,
                                            "thrombophlebitis": 1.4
                                        },
                                 
                                        "azithromycin": {
                                            "chlamydia": 0.3,
                                            "bacterial pneumonia": 0.4,
                                            "traveler's diarrhea": 0.3,
                                            "nausea": 1.2,
                                            "abdominal pain": 1.2
                                        },
                                      
                                        "clarithromycin": {
                                            "peptic ulcer disease": 0.3,
                                            "pneumonia": 0.4,
                                            "sinusitis": 0.4,
                                            "nausea": 1.2,
                                            "diarrhea": 1.3
                                        },
                                    
                                        
                                        "itraconazole": {
                                            "histoplasmosis": 0.3,
                                            "aspergillosis": 0.4,
                                            "candidiasis": 0.4,
                                            "hepatotoxicity": 1.4,
                                            "nausea": 1.2
                                        },
                                        "ketoconazole": {
                                            "dermatophytosis": 0.4,
                                            "candidiasis": 0.4,
                                            "tinea infections": 0.4,
                                            "hepatotoxicity": 1.5,
                                            "nausea": 1.2
                                        },
                                    
                                        
                                        "zidovudine": {
                                            "HIV/AIDS": 0.3,
                                            "bone marrow suppression": 1.5,
                                            "anemia": 1.4,
                                            "nausea": 1.3,
                                            "fatigue": 1.2
                                        },
                                        "nevirapine": {
                                            "HIV/AIDS": 0.3,
                                            "hepatotoxicity": 1.5,
                                            "rash": 1.4,
                                            "fatigue": 1.3
                                        },
                                        "lopinavir/ritonavir": {
                                            "HIV/AIDS": 0.3,
                                            "diarrhea": 1.3,
                                            "hyperlipidemia": 1.4,
                                            "nausea": 1.2
                                        },
                                    
                                    
                                    
                                     
                                        "nifedipine": {
                                            "hypertension": 0.3,
                                            "angina": 0.4,
                                            "headache": 1.3,
                                            "dizziness": 1.2,
                                            "flushing": 1.2
                                        },
                                    
                                        
                                        "glipizide": {
                                            "type 2 diabetes": 0.3,
                                            "hypoglycemia": 1.5,
                                            "weight gain": 1.3,
                                            "nausea": 1.2
                                        },
                                      
                                    
                                        
                                        "diphenoxylate": {
                                            "diarrhea": 0.4,
                                            "constipation": 1.4,
                                            "drowsiness": 1.3,
                                            "dry mouth": 1.2
                                        },
                                    
                                        
                                        "levetiracetam": {
                                            "epilepsy": 0.3,
                                            "fatigue": 1.3,
                                            "dizziness": 1.2,
                                            "mood changes": 1.4
                                        },
                                        "phenytoin": {
                                            "epilepsy": 0.3,
                                            "gingival hyperplasia": 1.5,
                                            "nystagmus": 1.4,
                                            "rash": 1.2
                                        },
                                      
                                    
                                        
                                        "methylprednisolone": {
                                            "inflammatory conditions": 0.4,
                                            "asthma": 0.4,
                                            "rheumatoid arthritis": 0.4,
                                            "osteoporosis": 1.5,
                                            "hyperglycemia": 1.4
                                        },
                                    
                                        
                                        "salbutamol": {
                                            "asthma": 0.4,
                                            "chronic obstructive pulmonary disease (COPD)": 0.4,
                                            "tremor": 1.3,
                                            "tachycardia": 1.4
                                        },
                                        "ipratropium": {
                                            "COPD": 0.4,
                                            "asthma": 0.4,
                                            "dry mouth": 1.3,
                                            "cough": 1.2
                                        },
                                    
                                        
                                        "fluoxetine": {
                                            "depression": 0.4,
                                            "anxiety disorders": 0.4,
                                            "insomnia": 1.3,
                                            "nausea": 1.2,
                                            "sexual dysfunction": 1.4
                                        },
                                   
                                        "amitriptyline": {
                                            "depression": 0.4,
                                            "neuropathic pain": 0.4,
                                            "drowsiness": 1.3,
                                            "dry mouth": 1.2,
                                            "weight gain": 1.3
                                        }
                                      
                                 
                                     
                                    }
                                    
                                    export default drugHistoryWeights;
