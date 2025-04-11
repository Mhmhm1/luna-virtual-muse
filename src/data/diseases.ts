
import { Disease } from '../types/health';

export const diseases: Disease[] = [
  {
    id: 'common-cold',
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract that primarily affects the nose and throat.',
    commonSymptoms: ['runny-nose', 'sore-throat', 'cough', 'fever', 'headache'],
    medications: [
      {
        name: 'Acetaminophen (Tylenol)',
        dosage: '500-1000mg',
        frequency: 'Every 4-6 hours as needed',
        duration: 'Up to 3 days',
        sideEffects: ['Liver damage (with overuse)', 'Nausea', 'Abdominal pain']
      },
      {
        name: 'Pseudoephedrine (Sudafed)',
        dosage: '60mg',
        frequency: 'Every 4-6 hours',
        duration: 'Up to 7 days',
        sideEffects: ['Nervousness', 'Dizziness', 'Increased blood pressure']
      }
    ],
    specialist: {
      title: 'General Practitioner',
      field: 'Primary Care',
      description: 'A doctor who treats acute and chronic illnesses and provides preventive care.'
    },
    severity: 'mild'
  },
  {
    id: 'flu',
    name: 'Influenza (Flu)',
    description: 'A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.',
    commonSymptoms: ['fever', 'cough', 'sore-throat', 'fatigue', 'headache', 'chills'],
    medications: [
      {
        name: 'Oseltamivir (Tamiflu)',
        dosage: '75mg',
        frequency: 'Twice daily',
        duration: '5 days',
        sideEffects: ['Nausea', 'Vomiting', 'Headache']
      },
      {
        name: 'Ibuprofen (Advil)',
        dosage: '400-600mg',
        frequency: 'Every 6-8 hours as needed',
        duration: 'Up to 5 days',
        sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness']
      }
    ],
    specialist: {
      title: 'General Practitioner',
      field: 'Primary Care',
      description: 'A doctor who treats acute and chronic illnesses and provides preventive care.'
    },
    severity: 'moderate'
  },
  {
    id: 'migraine',
    name: 'Migraine',
    description: 'A neurological condition characterized by intense, debilitating headaches often accompanied by nausea and sensitivity to light and sound.',
    commonSymptoms: ['headache', 'blurred-vision', 'nausea', 'dizziness'],
    medications: [
      {
        name: 'Sumatriptan (Imitrex)',
        dosage: '50-100mg',
        frequency: 'At onset of migraine, can repeat after 2 hours if needed',
        duration: 'As needed, not to exceed 200mg in 24 hours',
        sideEffects: ['Tightness in chest', 'Dizziness', 'Drowsiness']
      },
      {
        name: 'Propranolol',
        dosage: '40-160mg',
        frequency: 'Daily',
        duration: 'Long-term preventive use',
        sideEffects: ['Fatigue', 'Dizziness', 'Cold hands and feet']
      }
    ],
    specialist: {
      title: 'Neurologist',
      field: 'Neurology',
      description: 'A specialist who diagnoses and treats disorders of the nervous system, including the brain, spinal cord, and nerves.'
    },
    severity: 'moderate'
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    description: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid.',
    commonSymptoms: ['cough', 'fever', 'shortness-of-breath', 'chest-pain', 'fatigue'],
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7-10 days',
        sideEffects: ['Diarrhea', 'Nausea', 'Rash']
      },
      {
        name: 'Azithromycin',
        dosage: '500mg on first day, then 250mg',
        frequency: 'Once daily',
        duration: '5 days',
        sideEffects: ['Stomach upset', 'Diarrhea', 'Dizziness']
      }
    ],
    specialist: {
      title: 'Pulmonologist',
      field: 'Respiratory Medicine',
      description: 'A specialist who treats conditions affecting the respiratory system, including the lungs and breathing.'
    },
    severity: 'severe'
  },
  {
    id: 'gastroenteritis',
    name: 'Gastroenteritis (Stomach Flu)',
    description: 'An inflammation of the lining of the intestines caused by a virus, bacteria, or parasites.',
    commonSymptoms: ['nausea', 'diarrhea', 'stomach-pain', 'fever', 'fatigue'],
    medications: [
      {
        name: 'Loperamide (Imodium)',
        dosage: '4mg initially, then 2mg',
        frequency: 'After each loose stool',
        duration: 'Up to 2 days, not to exceed 8mg per day',
        sideEffects: ['Constipation', 'Abdominal pain', 'Dizziness']
      },
      {
        name: 'Oral Rehydration Solution',
        dosage: 'As directed on package',
        frequency: 'After each loose stool',
        duration: 'Until diarrhea resolves',
        sideEffects: ['Generally well-tolerated']
      }
    ],
    specialist: {
      title: 'Gastroenterologist',
      field: 'Gastroenterology',
      description: 'A specialist who diagnoses and treats conditions affecting the digestive system.'
    },
    severity: 'moderate'
  },
  {
    id: 'arthritis',
    name: 'Osteoarthritis',
    description: 'A degenerative joint disease that occurs when the protective cartilage that cushions the ends of your bones wears down over time.',
    commonSymptoms: ['joint-pain', 'swelling', 'stiffness', 'reduced-range-of-motion'],
    medications: [
      {
        name: 'Acetaminophen (Tylenol)',
        dosage: '500-1000mg',
        frequency: 'Every 4-6 hours as needed',
        duration: 'As needed for pain',
        sideEffects: ['Liver damage (with overuse)', 'Nausea', 'Abdominal pain']
      },
      {
        name: 'Naproxen (Aleve)',
        dosage: '220-440mg',
        frequency: 'Every 8-12 hours',
        duration: 'As needed for pain and inflammation',
        sideEffects: ['Stomach upset', 'Heartburn', 'Increased risk of heart attack and stroke']
      }
    ],
    specialist: {
      title: 'Rheumatologist',
      field: 'Rheumatology',
      description: 'A specialist who diagnoses and treats arthritis and other diseases of the joints, muscles, and bones.'
    },
    severity: 'moderate'
  },
  {
    id: 'allergic-reaction',
    name: 'Allergic Reaction',
    description: 'An immune system response to a substance that the body mistakenly identifies as harmful.',
    commonSymptoms: ['rash', 'itching', 'swelling', 'shortness-of-breath', 'runny-nose'],
    medications: [
      {
        name: 'Diphenhydramine (Benadryl)',
        dosage: '25-50mg',
        frequency: 'Every 4-6 hours as needed',
        duration: 'Until symptoms resolve',
        sideEffects: ['Drowsiness', 'Dry mouth', 'Dizziness']
      },
      {
        name: 'Cetirizine (Zyrtec)',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: 'As needed for symptoms',
        sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue']
      }
    ],
    specialist: {
      title: 'Allergist',
      field: 'Allergy and Immunology',
      description: 'A specialist who diagnoses and treats allergies and other problems with the immune system.'
    },
    severity: 'mild'
  }
];

export const getDiseaseById = (id: string): Disease | undefined => {
  return diseases.find(disease => disease.id === id);
};

export const analyzeSymptomsForDiseases = (symptomIds: string[]): Disease[] => {
  if (!symptomIds.length) return [];
  
  // Calculate a match score for each disease based on how many of the user's symptoms match
  const diseasesWithScores = diseases.map(disease => {
    // Count how many of the user's symptoms match this disease
    const matchingSymptoms = disease.commonSymptoms.filter(id => symptomIds.includes(id));
    
    // Calculate score as percentage of disease symptoms that match
    const matchPercentage = matchingSymptoms.length / disease.commonSymptoms.length;
    
    // Calculate coverage as percentage of user symptoms that are explained by this disease
    const coveragePercentage = matchingSymptoms.length / symptomIds.length;
    
    // Combined score gives weight to both match and coverage
    const combinedScore = (matchPercentage * 0.7) + (coveragePercentage * 0.3);
    
    return {
      disease,
      score: combinedScore,
      matchCount: matchingSymptoms.length
    };
  });
  
  // Filter to diseases with at least one matching symptom
  const potentialMatches = diseasesWithScores
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.score - a.score);
  
  // Return top matches (up to 3)
  return potentialMatches.slice(0, 3).map(item => item.disease);
};
