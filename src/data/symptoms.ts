
import { Symptom, BodyCategory } from '../types/health';

export const symptoms: Symptom[] = [
  // Head symptoms
  {
    id: 'headache',
    name: 'Headache',
    category: 'head',
    description: 'Pain in the head varying in intensity and location'
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    category: 'head',
    description: 'Feeling lightheaded or unsteady'
  },
  {
    id: 'blurred-vision',
    name: 'Blurred Vision',
    category: 'head',
    description: 'Inability to see fine details'
  },
  {
    id: 'earache',
    name: 'Earache',
    category: 'head',
    description: 'Pain in one or both ears'
  },
  {
    id: 'sore-throat',
    name: 'Sore Throat',
    category: 'head',
    description: 'Pain or irritation in the throat that worsens when swallowing'
  },
  {
    id: 'runny-nose',
    name: 'Runny Nose',
    category: 'head',
    description: 'Excess discharge of fluid from the nose'
  },
  
  // Chest symptoms
  {
    id: 'chest-pain',
    name: 'Chest Pain',
    category: 'chest',
    description: 'Discomfort or pain in the chest area'
  },
  {
    id: 'shortness-of-breath',
    name: 'Shortness of Breath',
    category: 'chest',
    description: 'Difficulty breathing or feeling like you can\'t get enough air'
  },
  {
    id: 'cough',
    name: 'Cough',
    category: 'chest',
    description: 'Sudden expulsion of air from the lungs'
  },
  {
    id: 'rapid-heartbeat',
    name: 'Rapid Heartbeat',
    category: 'chest',
    description: 'Heart beating faster than normal'
  },
  
  // Abdomen symptoms
  {
    id: 'stomach-pain',
    name: 'Stomach Pain',
    category: 'abdomen',
    description: 'Pain in the abdominal region'
  },
  {
    id: 'nausea',
    name: 'Nausea',
    category: 'abdomen',
    description: 'Feeling of sickness with an inclination to vomit'
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    category: 'abdomen',
    description: 'Loose, watery bowel movements'
  },
  {
    id: 'constipation',
    name: 'Constipation',
    category: 'abdomen',
    description: 'Difficulty passing stool or infrequent bowel movements'
  },
  {
    id: 'bloating',
    name: 'Bloating',
    category: 'abdomen',
    description: 'Feeling of fullness or swelling in the abdomen'
  },
  
  // Limbs symptoms
  {
    id: 'joint-pain',
    name: 'Joint Pain',
    category: 'limbs',
    description: 'Discomfort in one or more joints'
  },
  {
    id: 'muscle-weakness',
    name: 'Muscle Weakness',
    category: 'limbs',
    description: 'Reduced strength in one or more muscles'
  },
  {
    id: 'swelling',
    name: 'Swelling',
    category: 'limbs',
    description: 'Enlargement of a body part due to fluid accumulation'
  },
  {
    id: 'numbness',
    name: 'Numbness',
    category: 'limbs',
    description: 'Loss of sensation in a body part'
  },
  
  // Skin symptoms
  {
    id: 'rash',
    name: 'Rash',
    category: 'skin',
    description: 'Abnormal change in skin color or texture'
  },
  {
    id: 'itching',
    name: 'Itching',
    category: 'skin',
    description: 'Irritating sensation causing a desire to scratch'
  },
  {
    id: 'bruising',
    name: 'Bruising',
    category: 'skin',
    description: 'Discoloration of the skin due to broken blood vessels'
  },
  
  // General symptoms
  {
    id: 'fever',
    name: 'Fever',
    category: 'general',
    description: 'Elevated body temperature'
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    category: 'general',
    description: 'Feeling of tiredness or exhaustion'
  },
  {
    id: 'loss-of-appetite',
    name: 'Loss of Appetite',
    category: 'general',
    description: 'Reduced desire to eat'
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    category: 'general',
    description: 'Unintentional decrease in body weight'
  },
  {
    id: 'chills',
    name: 'Chills',
    category: 'general',
    description: 'Feeling of coldness with shivering'
  },
  {
    id: 'night-sweats',
    name: 'Night Sweats',
    category: 'general',
    description: 'Excessive sweating during sleep'
  }
];

export const getSymptomsByCategory = (category: BodyCategory): Symptom[] => {
  return symptoms.filter(symptom => symptom.category === category);
};

export const getSymptomById = (id: string): Symptom | undefined => {
  return symptoms.find(symptom => symptom.id === id);
};

export const getAllCategories = (): BodyCategory[] => {
  return ['head', 'chest', 'abdomen', 'limbs', 'skin', 'general'];
};

export const getCategoryLabel = (category: BodyCategory): string => {
  const labels: Record<BodyCategory, string> = {
    head: 'Head & Neck',
    chest: 'Chest & Respiratory',
    abdomen: 'Abdomen & Digestive',
    limbs: 'Arms & Legs',
    skin: 'Skin & Hair',
    general: 'General Symptoms'
  };
  
  return labels[category];
};
