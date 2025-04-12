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
  {
    id: 'numbness',
    name: 'Numbness',
    category: 'neurological',
    description: 'Loss of sensation or feeling in parts of the body.'
  },
  {
    id: 'tremors',
    name: 'Tremors',
    category: 'neurological',
    description: 'Involuntary, rhythmic muscle contraction leading to shaking movements.'
  },
  {
    id: 'sleep-disturbances',
    name: 'Sleep Disturbances',
    category: 'neurological',
    description: 'Problems falling asleep, staying asleep, or experiencing restful sleep.'
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
  {
    id: 'sneezing',
    name: 'Sneezing',
    category: 'respiratory',
    description: 'Forceful, involuntary expulsion of air through the nose and mouth.'
  },
  {
    id: 'coughing-up-blood',
    name: 'Coughing Up Blood',
    category: 'respiratory',
    description: 'Expelling blood when coughing (hemoptysis).'
  },
  {
    id: 'phlegm',
    name: 'Phlegm Production',
    category: 'respiratory',
    description: 'Excess mucus produced by the respiratory tract, often coughed up.'
  },
  {
    id: 'sleep-apnea',
    name: 'Sleep Apnea',
    category: 'respiratory',
    description: 'Breathing repeatedly stops and starts during sleep.'
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
  {
    id: 'blood-in-stool',
    name: 'Blood in Stool',
    category: 'digestive',
    description: 'Presence of blood in bowel movements.'
  },
  {
    id: 'difficulty-swallowing',
    name: 'Difficulty Swallowing',
    category: 'digestive',
    description: 'Trouble moving food or liquid from mouth to stomach (dysphagia).'
  },
  {
    id: 'acid-reflux',
    name: 'Acid Reflux',
    category: 'digestive',
    description: 'Stomach acid flows back into the esophagus, causing irritation.'
  },
  {
    id: 'excessive-gas',
    name: 'Excessive Gas',
    category: 'digestive',
    description: 'Increased belching, flatulence, or abdominal distention due to gas.'
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
  {
    id: 'bone-pain',
    name: 'Bone Pain',
    category: 'musculoskeletal',
    description: 'Pain originating from bone tissue, often deep, penetrating, or dull.'
  },
  {
    id: 'joint-stiffness',
    name: 'Joint Stiffness',
    category: 'musculoskeletal',
    description: 'Decreased ease of movement in a joint, often with pain.'
  },
  {
    id: 'muscle-twitching',
    name: 'Muscle Twitching',
    category: 'musculoskeletal',
    description: 'Small, involuntary contractions of muscle groups (fasciculations).'
  },
  {
    id: 'neck-pain',
    name: 'Neck Pain',
    category: 'musculoskeletal',
    description: 'Discomfort or pain in the neck region.'
  },
  {
    id: 'joint-locking',
    name: 'Joint Locking',
    category: 'musculoskeletal',
    description: 'Temporary inability to move a joint either into a straightened position or a bent position.'
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
  {
    id: 'skin-lesions',
    name: 'Skin Lesions',
    category: 'dermatological',
    description: 'Abnormal growth or appearance of skin tissue.'
  },
  {
    id: 'skin-peeling',
    name: 'Skin Peeling',
    category: 'dermatological',
    description: 'Top layer of skin coming off in flakes or sheets.'
  },
  {
    id: 'bruising',
    name: 'Easy Bruising',
    category: 'dermatological',
    description: 'Tendency to develop bruises with minimal trauma.'
  },
  {
    id: 'skin-ulcers',
    name: 'Skin Ulcers',
    category: 'dermatological',
    description: 'Open sores on the skin that don\'t heal properly.'
  },
  {
    id: 'hair-loss',
    name: 'Hair Loss',
    category: 'dermatological',
    description: 'Partial or complete loss of hair from areas where it normally grows.'
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
  {
    id: 'malaise',
    name: 'Malaise',
    category: 'general',
    description: 'A general feeling of discomfort, illness, or unease.'
  },
  {
    id: 'weight-gain',
    name: 'Unexpected Weight Gain',
    category: 'general',
    description: 'Gaining weight without changes in diet or exercise habits.'
  },
  {
    id: 'dehydration',
    name: 'Dehydration',
    category: 'general',
    description: 'Excessive loss of body fluids causing thirst, dry mouth, dark urine, and weakness.'
  },
  {
    id: 'loss-of-consciousness',
    name: 'Loss of Consciousness',
    category: 'general',
    description: 'Temporary or prolonged loss of awareness and responsiveness to the environment.'
  },
  {
    id: 'thirst',
    name: 'Excessive Thirst',
    category: 'general',
    description: 'Abnormal feeling of needing to drink fluids, often persistent.'
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
  {
    id: 'chest-pressure',
    name: 'Chest Pressure',
    category: 'cardiovascular',
    description: 'Sensation of tightness, squeezing, or compression in the chest.'
  },
  {
    id: 'cold-extremities',
    name: 'Cold Extremities',
    category: 'cardiovascular',
    description: 'Unusually cold hands or feet, possibly due to poor circulation.'
  },
  {
    id: 'bluish-skin',
    name: 'Bluish Skin Discoloration',
    category: 'cardiovascular',
    description: 'Skin taking on a bluish tint (cyanosis), often in lips, fingers, or toes.'
  },
  {
    id: 'fainting',
    name: 'Fainting',
    category: 'cardiovascular',
    description: 'Temporary loss of consciousness due to reduced blood flow to the brain.'
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
  {
    id: 'nasal-discharge',
    name: 'Nasal Discharge',
    category: 'ent',
    description: 'Secretion from the nasal passages, which may be clear, white, yellow, or green.'
  },
  {
    id: 'ear-discharge',
    name: 'Ear Discharge',
    category: 'ent',
    description: 'Fluid coming from the ear canal, which may be clear, bloody, or pus-like.'
  },
  {
    id: 'sinus-pressure',
    name: 'Sinus Pressure',
    category: 'ent',
    description: 'Feeling of fullness or pressure in the forehead, cheeks, or around the eyes.'
  },
  {
    id: 'post-nasal-drip',
    name: 'Post-Nasal Drip',
    category: 'ent',
    description: 'Mucus dripping from the back of the nose into the throat.'
  },
  {
    id: 'vertigo',
    name: 'Vertigo',
    category: 'ent',
    description: 'A sensation that you or your surroundings are spinning or moving.'
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
  },
  {
    id: 'urgency-to-urinate',
    name: 'Urgency to Urinate',
    category: 'urinary',
    description: 'Sudden, compelling urge to urinate that is difficult to delay.'
  },
  {
    id: 'cloudy-urine',
    name: 'Cloudy Urine',
    category: 'urinary',
    description: 'Urine that appears opaque or milky instead of clear.'
  },
  {
    id: 'difficulty-urinating',
    name: 'Difficulty Urinating',
    category: 'urinary',
    description: 'Trouble starting or maintaining urination.'
  },
  {
    id: 'urine-odor',
    name: 'Strong Urine Odor',
    category: 'urinary',
    description: 'Urine with an unusually strong or unpleasant smell.'
  },
  {
    id: 'urinary-retention',
    name: 'Urinary Retention',
    category: 'urinary',
    description: 'Inability to empty the bladder completely.'
  },
  
  // Endocrine symptoms
  {
    id: 'increased-thirst',
    name: 'Increased Thirst',
    category: 'general',
    description: 'Abnormal feeling of needing to drink fluids frequently.'
  },
  {
    id: 'increased-hunger',
    name: 'Increased Hunger',
    category: 'general',
    description: 'Excessive appetite despite adequate food intake.'
  },
  {
    id: 'heat-intolerance',
    name: 'Heat Intolerance',
    category: 'general',
    description: 'Discomfort when in warm environments or during hot weather.'
  },
  {
    id: 'cold-intolerance',
    name: 'Cold Intolerance',
    category: 'general',
    description: 'Unusual sensitivity to cold temperatures.'
  },
  
  // Psychological symptoms
  {
    id: 'anxiety',
    name: 'Anxiety',
    category: 'neurological',
    description: 'Feelings of worry, nervousness, or unease about something with an uncertain outcome.'
  },
  {
    id: 'depression',
    name: 'Depression',
    category: 'neurological',
    description: 'Persistent feelings of sadness and loss of interest in activities.'
  },
  {
    id: 'mood-swings',
    name: 'Mood Swings',
    category: 'neurological',
    description: 'Rapid and extreme fluctuations in mood.'
  },
  {
    id: 'irritability',
    name: 'Irritability',
    category: 'neurological',
    description: 'Easily annoyed or provoked to anger.'
  },
  
  // Additional symptoms for new diseases
  
  // Slow healing wounds (diabetes)
  {
    id: 'slow-healing-wounds',
    name: 'Slow Healing Wounds',
    category: 'dermatological',
    description: 'Cuts, scrapes, or sores that take longer than usual to heal, often associated with diabetes.'
  },
  
  // Reproductive and STI related symptoms
  {
    id: 'abnormal-discharge',
    name: 'Abnormal Discharge',
    category: 'reproductive',
    description: 'Unusual fluid from the vagina or penis, often a sign of infection.'
  },
  {
    id: 'pain-during-sex',
    name: 'Pain During Sex',
    category: 'reproductive',
    description: 'Discomfort or pain experienced during sexual intercourse.'
  },
  {
    id: 'testicular-pain',
    name: 'Testicular Pain',
    category: 'reproductive',
    description: 'Discomfort or pain in one or both testicles.'
  },
  {
    id: 'bleeding-between-periods',
    name: 'Bleeding Between Periods',
    category: 'reproductive',
    description: 'Vaginal bleeding that occurs at times other than during a normal menstrual period.'
  },
  {
    id: 'lower-abdominal-pain',
    name: 'Lower Abdominal Pain',
    category: 'reproductive',
    description: 'Pain or discomfort in the lower abdominal region, which may be related to reproductive organs.'
  },
  
  // Metabolic and endocrine symptoms
  {
    id: 'weight-changes',
    name: 'Unexpected Weight Changes',
    category: 'metabolic',
    description: 'Unexplained weight gain or loss without changes in diet or exercise.'
  },
  {
    id: 'pelvic-pain',
    name: 'Pelvic Pain',
    category: 'reproductive',
    description: 'Pain in the pelvic region, which may be related to urinary or reproductive conditions.'
  },
  {
    id: 'muscle-pain',
    name: 'Muscle Pain',
    category: 'musculoskeletal',
    description: 'Aching or soreness in the muscles, often associated with infections or inflammatory conditions.'
  },
  {
    id: 'sweating',
    name: 'Excessive Sweating',
    category: 'general',
    description: 'Abnormal amounts of sweating, often associated with infections or hormonal conditions.'
  }
];

export const getAllCategories = (): BodyCategory[] => {
  return [
    'neurological', 
    'respiratory', 
    'digestive', 
    'musculoskeletal', 
    'dermatological', 
    'general', 
    'cardiovascular', 
    'ent', 
    'urinary',
    'reproductive',
    'metabolic'
  ];
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
    case 'reproductive':
      return 'Reproductive System';
    case 'metabolic':
      return 'Metabolic & Hormonal';
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
