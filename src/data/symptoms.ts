import { Symptom, BodyCategory } from '../types/health';

export const symptoms: Symptom[] = [
  {
    id: 'headache',
    name: 'Headache',
    category: 'neurological',
    description: 'A continuous pain in the head.'
  },
  {
    id: 'blurred-vision',
    name: 'Blurred Vision',
    category: 'neurological',
    description: 'Loss of sharpness of eyesight, making objects appear out of focus.'
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    category: 'neurological',
    description: 'A sensation of spinning around and losing one\'s balance.'
  },
  {
    id: 'sore-throat',
    name: 'Sore Throat',
    category: 'respiratory',
    description: 'Pain or irritation in the throat.'
  },
  {
    id: 'cough',
    name: 'Cough',
    category: 'respiratory',
    description: 'A voluntary or involuntary act that clears the throat and breathing passage of foreign particles, fluids, mucus, or irritants.'
  },
  {
    id: 'shortness-of-breath',
    name: 'Shortness of Breath',
    category: 'respiratory',
    description: 'Difficulty in breathing or feeling like you are not getting enough air.'
  },
  {
    id: 'chest-pain',
    name: 'Chest Pain',
    category: 'respiratory',
    description: 'Pain or discomfort in the chest, typically felt in the front of the body from the neck to the upper abdomen.'
  },
  {
    id: 'nausea',
    name: 'Nausea',
    category: 'digestive',
    description: 'A feeling of sickness with an inclination to vomit.'
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    category: 'digestive',
    description: 'Frequent and liquid bowel movements.'
  },
  {
    id: 'stomach-pain',
    name: 'Stomach Pain',
    category: 'digestive',
    description: 'Pain or discomfort felt in the abdomen.'
  },
  {
    id: 'joint-pain',
    name: 'Joint Pain',
    category: 'musculoskeletal',
    description: 'Discomfort, pain, or ache in one or more joints.'
  },
  {
    id: 'swelling',
    name: 'Swelling',
    category: 'musculoskeletal',
    description: 'Abnormal enlargement of a part of the body, typically as a result of fluid accumulation or inflammation.'
  },
  {
    id: 'stiffness',
    name: 'Stiffness',
    category: 'musculoskeletal',
    description: 'Difficulty moving a joint or muscle.'
  },
  {
    id: 'reduced-range-of-motion',
    name: 'Reduced Range of Motion',
    category: 'musculoskeletal',
    description: 'Limitation in the extent to which a joint can be moved.'
  },
  {
    id: 'rash',
    name: 'Rash',
    category: 'dermatological',
    description: 'A change of the skin which affects its color, appearance, or texture.'
  },
  {
    id: 'itching',
    name: 'Itching',
    category: 'dermatological',
    description: 'An uncomfortable, irritating sensation that makes you want to scratch.'
  },
  {
    id: 'runny-nose',
    name: 'Runny Nose',
    category: 'dermatological',
    description: 'Nasal discharge.'
  },
  {
    id: 'fever',
    name: 'Fever',
    category: 'general',
    description: 'An abnormally high body temperature, usually accompanied by shivering, headache, and in severe instances, delirium.'
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    category: 'general',
    description: 'A feeling of tiredness or lack of energy.'
  },
  {
    id: 'chills',
    name: 'Chills',
    category: 'general',
    description: 'A sensation of cold accompanied by shivering.'
  }
];

export const getAllCategories = (): BodyCategory[] => {
  return ['neurological', 'respiratory', 'digestive', 'musculoskeletal', 'dermatological', 'general'];
};

export const getCategoryLabel = (category: BodyCategory): string => {
  switch (category) {
    case 'neurological':
      return 'Brain & Nerves';
    case 'respiratory':
      return 'Lungs & Breathing';
    case 'digestive':
      return 'Stomach & Digestion';
    case 'musculoskeletal':
      return 'Muscles & Joints';
    case 'dermatological':
      return 'Skin & Tissue';
    case 'general':
      return 'General Symptoms';
    default:
      return category;
  }
};

export const getSymptomsByCategory = (category: BodyCategory): Symptom[] => {
  return symptoms.filter(symptom => symptom.category === category);
};

export const getSymptomById = (id: string): Symptom | undefined => {
  return symptoms.find(symptom => symptom.id === id);
};
