
import { Symptom, BodyCategory } from '../types/health';

export const symptoms: Symptom[] = [
  // Neurological symptoms
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
    id: 'seizures',
    name: 'Seizures',
    category: 'neurological',
    description: 'Sudden, uncontrolled electrical disturbances in the brain.'
  },
  {
    id: 'tingling',
    name: 'Tingling Sensation',
    category: 'neurological',
    description: 'Pins and needles or prickling feeling in the skin.'
  },
  {
    id: 'memory-loss',
    name: 'Memory Loss',
    category: 'neurological',
    description: 'Unusual forgetfulness or inability to recall past events or information.'
  },
  {
    id: 'confusion',
    name: 'Confusion',
    category: 'neurological',
    description: 'Impaired orientation or cognitive function, difficulty thinking clearly.'
  },
  
  // Respiratory symptoms
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
    id: 'wheezing',
    name: 'Wheezing',
    category: 'respiratory',
    description: 'High-pitched whistling sound during breathing, often associated with difficulty breathing.'
  },
  {
    id: 'nasal-congestion',
    name: 'Nasal Congestion',
    category: 'respiratory',
    description: 'Stuffy nose or blocked nasal passages.'
  },
  {
    id: 'rapid-breathing',
    name: 'Rapid Breathing',
    category: 'respiratory',
    description: 'Breathing at a faster rate than normal (tachypnea).'
  },
  
  // Digestive symptoms
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
    id: 'vomiting',
    name: 'Vomiting',
    category: 'digestive',
    description: 'Forceful expulsion of stomach contents through the mouth.'
  },
  {
    id: 'constipation',
    name: 'Constipation',
    category: 'digestive',
    description: 'Difficulty or infrequency in bowel movements.'
  },
  {
    id: 'bloating',
    name: 'Bloating',
    category: 'digestive',
    description: 'Swelling or feeling of fullness in the abdomen.'
  },
  {
    id: 'heartburn',
    name: 'Heartburn',
    category: 'digestive',
    description: 'Burning sensation in the chest, often after eating.'
  },
  {
    id: 'loss-of-appetite',
    name: 'Loss of Appetite',
    category: 'digestive',
    description: 'Reduced desire to eat or lack of interest in food.'
  },
  
  // Musculoskeletal symptoms
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
    id: 'muscle-weakness',
    name: 'Muscle Weakness',
    category: 'musculoskeletal',
    description: 'Reduced strength in one or more muscles.'
  },
  {
    id: 'back-pain',
    name: 'Back Pain',
    category: 'musculoskeletal',
    description: 'Discomfort in the back area, ranging from mild to severe.'
  },
  {
    id: 'muscle-cramps',
    name: 'Muscle Cramps',
    category: 'musculoskeletal',
    description: 'Sudden, involuntary contractions of muscles that can cause intense pain.'
  },
  
  // Dermatological symptoms
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
    id: 'skin-discoloration',
    name: 'Skin Discoloration',
    category: 'dermatological',
    description: 'Changes in skin color, including yellowing, redness, or darkening.'
  },
  {
    id: 'dry-skin',
    name: 'Dry Skin',
    category: 'dermatological',
    description: 'Skin that feels rough, tight, or scaly due to lack of moisture.'
  },
  {
    id: 'excessive-sweating',
    name: 'Excessive Sweating',
    category: 'dermatological',
    description: 'Abnormally increased perspiration beyond what is needed for temperature regulation.'
  },
  {
    id: 'hives',
    name: 'Hives',
    category: 'dermatological',
    description: 'Raised, itchy welts on the skin, often due to an allergic reaction.'
  },
  
  // General symptoms
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
  },
  {
    id: 'weight-loss',
    name: 'Unexplained Weight Loss',
    category: 'general',
    description: 'Losing weight without trying, often a sign of underlying health issues.'
  },
  {
    id: 'night-sweats',
    name: 'Night Sweats',
    category: 'general',
    description: 'Excessive sweating during sleep, often soaking bed linens.'
  },
  {
    id: 'weakness',
    name: 'General Weakness',
    category: 'general',
    description: 'Overall feeling of lack of strength or energy throughout the body.'
  },
  {
    id: 'swollen-lymph-nodes',
    name: 'Swollen Lymph Nodes',
    category: 'general',
    description: 'Enlarged lymph nodes that may be tender to touch, often due to infection or inflammation.'
  },
  
  // Cardiovascular symptoms
  {
    id: 'palpitations',
    name: 'Heart Palpitations',
    category: 'cardiovascular',
    description: 'Sensations of your heart racing, pounding, or skipping beats.'
  },
  {
    id: 'high-blood-pressure',
    name: 'High Blood Pressure',
    category: 'cardiovascular',
    description: 'Blood pressure that is higher than normal, often without symptoms.'
  },
  {
    id: 'irregular-heartbeat',
    name: 'Irregular Heartbeat',
    category: 'cardiovascular',
    description: 'Heart rhythm that is abnormal or inconsistent.'
  },
  {
    id: 'edema',
    name: 'Edema',
    category: 'cardiovascular',
    description: 'Swelling caused by excess fluid trapped in body tissues, often in the lower limbs.'
  },
  
  // ENT (Ear, Nose, Throat) symptoms
  {
    id: 'ear-pain',
    name: 'Ear Pain',
    category: 'ent',
    description: 'Discomfort or pain in one or both ears.'
  },
  {
    id: 'hearing-loss',
    name: 'Hearing Loss',
    category: 'ent',
    description: 'Partial or complete inability to hear sounds in one or both ears.'
  },
  {
    id: 'tinnitus',
    name: 'Tinnitus',
    category: 'ent',
    description: 'Ringing, buzzing, or other sounds in the ears without an external source.'
  },
  {
    id: 'hoarseness',
    name: 'Hoarseness',
    category: 'ent',
    description: 'Abnormal change in voice, often sounding rough, raspy, or strained.'
  },
  
  // Urinary symptoms
  {
    id: 'frequent-urination',
    name: 'Frequent Urination',
    category: 'urinary',
    description: 'Need to urinate more often than usual.'
  },
  {
    id: 'painful-urination',
    name: 'Painful Urination',
    category: 'urinary',
    description: 'Discomfort, burning, or pain when urinating.'
  },
  {
    id: 'blood-in-urine',
    name: 'Blood in Urine',
    category: 'urinary',
    description: 'Presence of blood in urine, causing it to appear pink, red, or cola-colored.'
  },
  {
    id: 'urinary-incontinence',
    name: 'Urinary Incontinence',
    category: 'urinary',
    description: 'Loss of bladder control, resulting in unintentional passing of urine.'
  }
];

export const getAllCategories = (): BodyCategory[] => {
  return ['neurological', 'respiratory', 'digestive', 'musculoskeletal', 'dermatological', 'general', 'cardiovascular', 'ent', 'urinary'];
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
    case 'cardiovascular':
      return 'Heart & Blood Vessels';
    case 'ent':
      return 'Ear, Nose & Throat';
    case 'urinary':
      return 'Urinary System';
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

export const searchSymptoms = (query: string): Symptom[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  return symptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(lowerQuery) || 
    symptom.description.toLowerCase().includes(lowerQuery)
  );
};
