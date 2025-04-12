import { Disease, Doctor } from '../types/health';

// Sample doctor data
const doctors: Record<string, Doctor[]> = {
  'neurologist': [
    {
      id: 'doc-1',
      name: 'Dr. Sarah Kimani',
      photoUrl: 'https://randomuser.me/api/portraits/women/25.jpg',
      specialty: 'Neurologist',
      hospital: 'Nairobi Hospital',
      experience: '15 years',
      licenseNumber: 'KEN-MD-23581',
      phone: '+254 722 123 456',
      bio: 'Specializes in migraines and headache disorders with advanced training in headache medicine.',
      rating: 4.8,
      available: true
    },
    {
      id: 'doc-2',
      name: 'Dr. James Omondi',
      photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      specialty: 'Neurologist',
      hospital: 'Aga Khan University Hospital',
      experience: '12 years',
      licenseNumber: 'KEN-MD-31942',
      phone: '+254 733 456 789',
      bio: 'Focused on neurological disorders with special interest in migraine research.',
      rating: 4.5,
      available: true
    },
    {
      id: 'doc-3',
      name: 'Dr. Esther Wangari',
      photoUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
      specialty: 'Neurologist',
      hospital: 'Kenyatta National Hospital',
      experience: '20 years',
      licenseNumber: 'KEN-MD-19726',
      phone: '+254 712 345 678',
      bio: 'Extensive experience in treating complex neurological conditions and headache disorders.',
      rating: 4.9,
      available: false
    }
  ],
  'pulmonologist': [
    {
      id: 'doc-4',
      name: 'Dr. David Mutua',
      photoUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
      specialty: 'Pulmonologist',
      hospital: 'Nairobi West Hospital',
      experience: '10 years',
      licenseNumber: 'KEN-MD-27845',
      phone: '+254 722 987 654',
      bio: 'Specializes in respiratory diseases with particular focus on pneumonia and asthma.',
      rating: 4.7,
      available: true
    },
    {
      id: 'doc-5',
      name: 'Dr. Grace Mwangi',
      photoUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
      specialty: 'Pulmonologist',
      hospital: 'Mater Hospital',
      experience: '14 years',
      licenseNumber: 'KEN-MD-22176',
      phone: '+254 733 876 543',
      bio: 'Expert in managing complex respiratory conditions including pneumonia and tuberculosis.',
      rating: 4.6,
      available: true
    },
    {
      id: 'doc-6',
      name: 'Dr. Peter Kamau',
      photoUrl: 'https://randomuser.me/api/portraits/men/41.jpg',
      specialty: 'Pulmonologist',
      hospital: 'MP Shah Hospital',
      experience: '18 years',
      licenseNumber: 'KEN-MD-18325',
      phone: '+254 712 765 432',
      bio: 'Renowned for his work in respiratory medicine with advanced training in critical care.',
      rating: 4.9,
      available: false
    }
  ],
  'gastroenterologist': [
    {
      id: 'doc-7',
      name: 'Dr. Mary Njeri',
      photoUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      specialty: 'Gastroenterologist',
      hospital: 'Nairobi Hospital',
      experience: '12 years',
      licenseNumber: 'KEN-MD-24593',
      phone: '+254 722 234 567',
      bio: 'Specializes in digestive disorders with expertise in gastroenteritis and IBD.',
      rating: 4.5,
      available: true
    },
    {
      id: 'doc-8',
      name: 'Dr. John Kariuki',
      photoUrl: 'https://randomuser.me/api/portraits/men/62.jpg',
      specialty: 'Gastroenterologist',
      hospital: 'Aga Khan University Hospital',
      experience: '15 years',
      licenseNumber: 'KEN-MD-21387',
      phone: '+254 733 345 678',
      bio: 'Expert in managing digestive system disorders with special interest in gastroenteritis research.',
      rating: 4.7,
      available: true
    },
    {
      id: 'doc-9',
      name: 'Dr. Mercy Wambui',
      photoUrl: 'https://randomuser.me/api/portraits/women/58.jpg',
      specialty: 'Gastroenterologist',
      hospital: 'Karen Hospital',
      experience: '17 years',
      licenseNumber: 'KEN-MD-19435',
      phone: '+254 712 456 789',
      bio: 'Renowned for her work in managing complex digestive conditions and gut health.',
      rating: 4.8,
      available: true
    }
  ],
  'rheumatologist': [
    {
      id: 'doc-10',
      name: 'Dr. Daniel Kiprop',
      photoUrl: 'https://randomuser.me/api/portraits/men/72.jpg',
      specialty: 'Rheumatologist',
      hospital: 'Nairobi Hospital',
      experience: '16 years',
      licenseNumber: 'KEN-MD-20134',
      phone: '+254 722 345 678',
      bio: 'Specializes in joint conditions with particular expertise in arthritis management.',
      rating: 4.6,
      available: true
    },
    {
      id: 'doc-11',
      name: 'Dr. Lucy Akinyi',
      photoUrl: 'https://randomuser.me/api/portraits/women/67.jpg',
      specialty: 'Rheumatologist',
      hospital: 'Kenyatta National Hospital',
      experience: '19 years',
      licenseNumber: 'KEN-MD-18752',
      phone: '+254 733 456 789',
      bio: 'Expert in diagnosing and treating arthritis and other joint disorders with a focus on innovative therapies.',
      rating: 4.9,
      available: true
    },
    {
      id: 'doc-12',
      name: 'Dr. Robert Otieno',
      photoUrl: 'https://randomuser.me/api/portraits/men/79.jpg',
      specialty: 'Rheumatologist',
      hospital: 'MP Shah Hospital',
      experience: '14 years',
      licenseNumber: 'KEN-MD-22964',
      phone: '+254 712 567 890',
      bio: 'Focused on musculoskeletal disorders with advanced training in arthritis and joint pain management.',
      rating: 4.7,
      available: false
    }
  ],
  'allergist': [
    {
      id: 'doc-13',
      name: 'Dr. Faith Wanjiku',
      photoUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
      specialty: 'Allergist & Immunologist',
      hospital: 'Aga Khan University Hospital',
      experience: '11 years',
      licenseNumber: 'KEN-MD-25476',
      phone: '+254 722 456 789',
      bio: 'Specializes in allergic conditions with expertise in managing complex allergic reactions.',
      rating: 4.5,
      available: true
    },
    {
      id: 'doc-14',
      name: 'Dr. Michael Maina',
      photoUrl: 'https://randomuser.me/api/portraits/men/29.jpg',
      specialty: 'Allergist & Immunologist',
      hospital: 'Nairobi Hospital',
      experience: '13 years',
      licenseNumber: 'KEN-MD-23748',
      phone: '+254 733 567 890',
      bio: 'Expert in diagnosing and treating allergic disorders with focus on patient education and prevention.',
      rating: 4.6,
      available: true
    },
    {
      id: 'doc-15',
      name: 'Dr. Joyce Kamau',
      photoUrl: 'https://randomuser.me/api/portraits/women/38.jpg',
      specialty: 'Allergist & Immunologist',
      hospital: "Gertrude's Children's Hospital",
      experience: '15 years',
      licenseNumber: 'KEN-MD-21593',
      phone: '+254 712 678 901',
      bio: 'Renowned for her work in pediatric allergies with special interest in managing allergic reactions in children.',
      rating: 4.8,
      available: true
    }
  ],
  'general-practitioner': [
    {
      id: 'doc-16',
      name: 'Dr. Samuel Otieno',
      photoUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
      specialty: 'General Practitioner',
      hospital: 'Nairobi West Hospital',
      experience: '9 years',
      licenseNumber: 'KEN-MD-26985',
      phone: '+254 722 567 890',
      bio: 'Comprehensive primary care provider with experience in managing common illnesses including colds and flu.',
      rating: 4.4,
      available: true
    },
    {
      id: 'doc-17',
      name: 'Dr. Ruth Nyambura',
      photoUrl: 'https://randomuser.me/api/portraits/women/47.jpg',
      specialty: 'General Practitioner',
      hospital: 'Coptic Hospital',
      experience: '11 years',
      licenseNumber: 'KEN-MD-24815',
      phone: '+254 733 678 901',
      bio: 'Primary care physician with special interest in preventive medicine and common respiratory conditions.',
      rating: 4.6,
      available: true
    },
    {
      id: 'doc-18',
      name: 'Dr. George Mwangi',
      photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
      specialty: 'General Practitioner',
      hospital: 'Karen Hospital',
      experience: '14 years',
      licenseNumber: 'KEN-MD-22137',
      phone: '+254 712 789 012',
      bio: 'Experienced family doctor with expertise in managing common ailments and providing holistic care.',
      rating: 4.7,
      available: false
    }
  ],
  'cardiologist': [
    {
      id: 'doc-19',
      name: 'Dr. Wanjiku Kamau',
      photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      specialty: 'Cardiologist',
      hospital: 'Nairobi Hospital',
      experience: '16 years',
      licenseNumber: 'KEN-MD-20589',
      phone: '+254 722 678 901',
      bio: 'Specializes in cardiovascular health with expertise in diagnosing and treating hypertension.',
      rating: 4.8,
      available: true
    },
    {
      id: 'doc-20',
      name: 'Dr. Thomas Odhiambo',
      photoUrl: 'https://randomuser.me/api/portraits/men/66.jpg',
      specialty: 'Cardiologist',
      hospital: 'Aga Khan University Hospital',
      experience: '18 years',
      licenseNumber: 'KEN-MD-19345',
      phone: '+254 733 789 012',
      bio: 'Expert in managing hypertension and other cardiovascular conditions with a focus on preventative care.',
      rating: 4.7,
      available: true
    },
    {
      id: 'doc-21',
      name: 'Dr. Grace Wangui',
      photoUrl: 'https://randomuser.me/api/portraits/women/77.jpg',
      specialty: 'Cardiologist',
      hospital: 'Karen Hospital',
      experience: '14 years',
      licenseNumber: 'KEN-MD-22748',
      phone: '+254 712 890 123',
      bio: 'Specialized in the management of complex cardiovascular diseases with a holistic approach to patient care.',
      rating: 4.5,
      available: true
    }
  ],
  'endocrinologist': [
    {
      id: 'doc-22',
      name: 'Dr. Peter Maina',
      photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
      specialty: 'Endocrinologist',
      hospital: 'Nairobi Hospital',
      experience: '15 years',
      licenseNumber: 'KEN-MD-21496',
      phone: '+254 722 789 012',
      bio: 'Specializes in diabetes management with expertise in tailoring treatment plans for individual needs.',
      rating: 4.7,
      available: true
    },
    {
      id: 'doc-23',
      name: 'Dr. Sarah Atieno',
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      specialty: 'Endocrinologist',
      hospital: 'Aga Khan University Hospital',
      experience: '17 years',
      licenseNumber: 'KEN-MD-19856',
      phone: '+254 733 890 123',
      bio: 'Expert in hormonal disorders with a focus on diabetes and thyroid conditions.',
      rating: 4.8,
      available: true
    },
    {
      id: 'doc-24',
      name: 'Dr. David Njoroge',
      photoUrl: 'https://randomuser.me/api/portraits/men/37.jpg',
      specialty: 'Endocrinologist',
      hospital: 'MP Shah Hospital',
      experience: '13 years',
      licenseNumber: 'KEN-MD-23647',
      phone: '+254 712 901 234',
      bio: 'Focuses on holistic management of metabolic disorders including diabetes.',
      rating: 4.6,
      available: false
    }
  ],
  'infectious-disease': [
    {
      id: 'doc-25',
      name: 'Dr. Elizabeth Mwangi',
      photoUrl: 'https://randomuser.me/api/portraits/women/36.jpg',
      specialty: 'Infectious Disease Specialist',
      hospital: 'Kenyatta National Hospital',
      experience: '19 years',
      licenseNumber: 'KEN-MD-18324',
      phone: '+254 722 890 123',
      bio: 'Specializes in tropical diseases with extensive experience in malaria and HIV management.',
      rating: 4.9,
      available: true
    },
    {
      id: 'doc-26',
      name: 'Dr. James Kimani',
      photoUrl: 'https://randomuser.me/api/portraits/men/35.jpg',
      specialty: 'Infectious Disease Specialist',
      hospital: 'Nairobi Hospital',
      experience: '14 years',
      licenseNumber: 'KEN-MD-22143',
      phone: '+254 733 901 234',
      bio: 'Expert in diagnosing and treating a wide range of infectious diseases including tuberculosis and malaria.',
      rating: 4.7,
      available: true
    },
    {
      id: 'doc-27',
      name: 'Dr. Faith Akinyi',
      photoUrl: 'https://randomuser.me/api/portraits/women/34.jpg',
      specialty: 'Infectious Disease Specialist',
      hospital: 'Aga Khan University Hospital',
      experience: '16 years',
      licenseNumber: 'KEN-MD-20487',
      phone: '+254 712 012 345',
      bio: 'Focuses on research and treatment of emerging infectious diseases with special interest in HIV care.',
      rating: 4.8,
      available: true
    }
  ],
  'urologist': [
    {
      id: 'doc-28',
      name: 'Dr. Martin Omondi',
      photoUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
      specialty: 'Urologist',
      hospital: 'Nairobi Hospital',
      experience: '18 years',
      licenseNumber: 'KEN-MD-19278',
      phone: '+254 722 901 234',
      bio: 'Specializes in urinary tract conditions with expertise in UTI management and prevention.',
      rating: 4.8,
      available: true
    },
    {
      id: 'doc-29',
      name: 'Dr. Mercy Wambui',
      photoUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
      specialty: 'Urologist',
      hospital: 'Aga Khan University Hospital',
      experience: '15 years',
      licenseNumber: 'KEN-MD-21538',
      phone: '+254 733 012 345',
      bio: 'Expert in managing urological conditions with a focus on patient education and preventative care.',
      rating: 4.7,
      available: true
    },
    {
      id: 'doc-30',
      name: 'Dr. Paul Njoroge',
      photoUrl: 'https://randomuser.me/api/portraits/men/31.jpg',
      specialty: 'Urologist',
      hospital: 'Karen Hospital',
      experience: '14 years',
      licenseNumber: 'KEN-MD-22367',
      phone: '+254 712 123 456',
      bio: 'Specializes in complex urological disorders with a comprehensive approach to diagnosis and treatment.',
      rating: 4.6,
      available: false
    }
  ],
  'gynecologist': [
    {
      id: 'doc-31',
      name: 'Dr. Esther Njeri',
      photoUrl: 'https://randomuser.me/api/portraits/women/31.jpg',
      specialty: 'Gynecologist',
      hospital: 'Nairobi Hospital',
      experience: '17 years',
      licenseNumber: 'KEN-MD-19822',
      phone: '+254 722 012 345',
      bio: 'Specializes in women\'s reproductive health with expertise in STI diagnosis and treatment.',
      rating: 4.8,
      available: true
    },
    {
      id: 'doc-32',
      name: 'Dr. Jane Muthoni',
      photoUrl: 'https://randomuser.me/api/portraits/women/30.jpg',
      specialty: 'Gynecologist',
      hospital: 'Aga Khan University Hospital',
      experience: '19 years',
      licenseNumber: 'KEN-MD-18493',
      phone: '+254 733 123 456',
      bio: 'Expert in reproductive health and women\'s wellness with a holistic approach to patient care.',
      rating: 4.9,
      available: true
    },
    {
      id: 'doc-33',
      name: 'Dr. Lilian Waithera',
      photoUrl: 'https://randomuser.me/api/portraits/women/29.jpg',
      specialty: 'Gynecologist',
      hospital: 'Karen Hospital',
      experience: '16 years',
      licenseNumber: 'KEN-MD-20712',
      phone: '+254 712 234 567',
      bio: 'Focuses on comprehensive women\'s health with special interest in reproductive infections.',
      rating: 4.7,
      available: false
    }
  ]
};

// Update the disease data to include doctor recommendations
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
      description: 'A doctor who treats acute and chronic illnesses and provides preventive care.',
      recommendedDoctors: doctors['general-practitioner']
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
      description: 'A doctor who treats acute and chronic illnesses and provides preventive care.',
      recommendedDoctors: doctors['general-practitioner']
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
      description: 'A specialist who diagnoses and treats disorders of the nervous system, including the brain, spinal cord, and nerves.',
      recommendedDoctors: doctors['neurologist']
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
      description: 'A specialist who treats conditions affecting the respiratory system, including the lungs and breathing.',
      recommendedDoctors: doctors['pulmonologist']
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
      description: 'A specialist who diagnoses and treats conditions affecting the digestive system.',
      recommendedDoctors: doctors['gastroenterologist']
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
      description: 'A specialist who diagnoses and treats arthritis and other diseases of the joints, muscles, and bones.',
      recommendedDoctors: doctors['rheumatologist']
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
      description: 'A specialist who diagnoses and treats allergies and other problems with the immune system.',
      recommendedDoctors: doctors['allergist']
    },
    severity: 'mild'
  },
  {
    id: 'hypertension',
    name: 'Hypertension (High Blood Pressure)',
    description: 'A condition in which the force of the blood against the artery walls is too high, potentially leading to health problems like heart disease.',
    commonSymptoms: ['headache', 'dizziness', 'chest-pain', 'shortness-of-breath', 'palpitations', 'high-blood-pressure', 'fatigue'],
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10-40mg',
        frequency: 'Once daily',
        duration: 'Long-term with regular monitoring',
        sideEffects: ['Dry cough', 'Dizziness', 'Headache']
      },
      {
        name: 'Amlodipine',
        dosage: '5-10mg',
        frequency: 'Once daily',
        duration: 'Long-term with regular monitoring',
        sideEffects: ['Edema', 'Flushing', 'Headache']
      }
    ],
    specialist: {
      title: 'Cardiologist',
      field: 'Cardiology',
      description: 'A specialist who diagnoses and treats diseases of the heart and blood vessels.',
      recommendedDoctors: doctors['cardiologist']
    },
    severity: 'moderate'
  },
  {
    id: 'diabetes',
    name: 'Type 2 Diabetes',
    description: 'A chronic condition affecting how the body processes blood sugar (glucose), often characterized by insulin resistance.',
    commonSymptoms: ['excessive-thirst', 'frequent-urination', 'increased-hunger', 'fatigue', 'blurred-vision', 'slow-healing-wounds', 'weight-loss'],
    medications: [
      {
        name: 'Metformin',
        dosage: '500-2000mg',
        frequency: 'Once or twice daily with meals',
        duration: 'Long-term with regular monitoring',
        sideEffects: ['Nausea', 'Diarrhea', 'Abdominal discomfort']
      },
      {
        name: 'Glipizide',
        dosage: '5-20mg',
        frequency: 'Once or twice daily before meals',
        duration: 'Long-term with regular monitoring',
        sideEffects: ['Hypoglycemia', 'Weight gain', 'Dizziness']
      }
    ],
    specialist: {
      title: 'Endocrinologist',
      field: 'Endocrinology',
      description: 'A specialist who diagnoses and treats disorders of the endocrine system, including diabetes.',
      recommendedDoctors: doctors['endocrinologist']
    },
    severity: 'moderate'
  },
  {
    id: 'malaria',
    name: 'Malaria',
    description: 'A serious disease caused by a parasite that commonly infects a certain type of mosquito which feeds on humans.',
    commonSymptoms: ['fever', 'chills', 'headache', 'nausea', 'vomiting', 'muscle-pain', 'fatigue', 'sweating'],
    medications: [
      {
        name: 'Artemether-Lumefantrine',
        dosage: 'Based on weight',
        frequency: 'Twice daily for 3 days',
        duration: 'Complete 3-day course',
        sideEffects: ['Headache', 'Dizziness', 'Loss of appetite']
      },
      {
        name: 'Dihydroartemisinin-Piperaquine',
        dosage: 'Based on weight',
        frequency: 'Once daily for 3 days',
        duration: 'Complete 3-day course',
        sideEffects: ['Nausea', 'Dizziness', 'Fatigue']
      }
    ],
    specialist: {
      title: 'Infectious Disease Specialist',
      field: 'Infectious Diseases',
      description: 'A specialist who diagnoses and treats infections, including tropical and parasitic diseases.',
      recommendedDoctors: doctors['infectious-disease']
    },
    severity: 'severe'
  },
  {
    id: 'tuberculosis',
    name: 'Tuberculosis (TB)',
    description: 'An infectious disease that mainly affects the lungs, caused by Mycobacterium tuberculosis bacteria.',
    commonSymptoms: ['cough', 'coughing-up-blood', 'chest-pain', 'fatigue', 'fever', 'night-sweats', 'weight-loss'],
    medications: [
      {
        name: 'Isoniazid',
        dosage: '300mg',
        frequency: 'Once daily',
        duration: '6-9 months',
        sideEffects: ['Liver damage', 'Peripheral neuropathy', 'Rash']
      },
      {
        name: 'Rifampin',
        dosage: '600mg',
        frequency: 'Once daily',
        duration: '6-9 months',
        sideEffects: ['Orange discoloration of bodily fluids', 'Liver damage', 'Flu-like symptoms']
      }
    ],
    specialist: {
      title: 'Pulmonologist',
      field: 'Respiratory Medicine',
      description: 'A specialist who treats conditions affecting the respiratory system, including tuberculosis.',
      recommendedDoctors: doctors['pulmonologist']
    },
    severity: 'severe'
  },
  {
    id: 'hiv',
    name: 'HIV Infection',
    description: 'Human Immunodeficiency Virus infection that attacks the body\'s immune system, potentially leading to AIDS if untreated.',
    commonSymptoms: ['fever', 'fatigue', 'swollen-lymph-nodes', 'sore-throat', 'rash', 'muscle-aches', 'night-sweats', 'weight-loss'],
    medications: [
      {
        name: 'Antiretroviral Therapy (ART)',
        dosage: 'As prescribed',
        frequency: 'Daily',
        duration: 'Lifelong',
        sideEffects: ['Nausea', 'Fatigue', 'Headache', 'Rash']
      },
      {
        name: 'Prophylactic Antibiotics',
        dosage: 'As prescribed',
        frequency: 'As directed',
        duration: 'As needed',
        sideEffects: ['Varies by antibiotic']
      }
    ],
    specialist: {
      title: 'Infectious Disease Specialist',
      field: 'Infectious Diseases',
      description: 'A specialist who diagnoses and treats HIV and other infectious diseases.',
      recommendedDoctors: doctors['infectious-disease']
    },
    severity: 'severe'
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection (UTI)',
    description: 'An infection in any part of the urinary system, including kidneys, bladder, ureters, and urethra.',
    commonSymptoms: ['painful-urination', 'frequent-urination', 'urgency-to-urinate', 'cloudy-urine', 'blood-in-urine', 'strong-urine-odor', 'pelvic-pain'],
    medications: [
      {
        name: 'Nitrofurantoin',
        dosage: '100mg',
        frequency: 'Twice daily',
        duration: '5-7 days',
        sideEffects: ['Nausea', 'Headache', 'Loss of appetite']
      },
      {
        name: 'Trimethoprim-Sulfamethoxazole',
        dosage: '160/800mg',
        frequency: 'Twice daily',
        duration: '3-5 days',
        sideEffects: ['Rash', 'Nausea', 'Diarrhea']
      }
    ],
    specialist: {
      title: 'Urologist',
      field: 'Urology',
      description: 'A specialist who diagnoses and treats conditions affecting the urinary tract and male reproductive system.',
      recommendedDoctors: doctors['urologist']
    },
    severity: 'moderate'
  },
  {
    id: 'chlamydia',
    name: 'Chlamydia',
    description: 'A common sexually transmitted infection caused by the bacterium Chlamydia trachomatis.',
    commonSymptoms: ['painful-urination', 'abnormal-discharge', 'pain-during-sex', 'lower-abdominal-pain', 'testicular-pain', 'bleeding-between-periods'],
    medications: [
      {
        name: 'Azithromycin',
        dosage: '1g',
        frequency: 'Single dose',
        duration: 'One-time treatment',
        sideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain']
      },
      {
        name: 'Doxycycline',
        dosage: '100mg',
        frequency: 'Twice daily',
        duration: '7 days',
        sideEffects: ['Photosensitivity', 'Nausea', 'Diarrhea']
      }
    ],
    specialist: {
      title: 'Gynecologist/Urologist',
      field: 'Sexual Health',
      description: 'Specialists who diagnose and treat sexually transmitted infections and related conditions.',
      recommendedDoctors: [...doctors['gynecologist'], ...doctors['urologist']]
    },
    severity: 'moderate'
  },
  {
    id: 'sinusitis',
    name: 'Sinusitis',
    description: 'Inflammation of the sinuses, often caused by infection, resulting in facial pain and nasal congestion.',
    commonSymptoms: ['nasal-congestion', 'sinus-pressure', 'facial-pain', 'headache', 'post-nasal-drip', 'cough', 'fever'],
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '10-14 days',
        sideEffects: ['Diarrhea', 'Rash', 'Nausea']
      },
      {
        name: 'Pseudoephedrine',
        dosage: '60mg',
        frequency: 'Every 4-6 hours',
        duration: 'Up to 7 days',
        sideEffects: ['Nervousness', 'Dizziness', 'Insomnia']
      }
    ],
    specialist: {
      title: 'ENT Specialist',
      field: 'Otolaryngology',
      description: 'A specialist who diagnoses and treats conditions affecting the ear, nose, and throat.',
      recommendedDoctors: doctors['general-practitioner']
    },
    severity: 'mild'
  },
  {
    id: 'thyroid-disorder',
    name: 'Thyroid Disorder',
    description: 'A condition affecting the thyroid gland, which can result in the overproduction or underproduction of thyroid hormones.',
    commonSymptoms: ['fatigue', 'weight-changes', 'cold-intolerance', 'heat-intolerance', 'mood-swings', 'irregular-heartbeat', 'muscle-weakness'],
    medications: [
      {
        name: 'Levothyroxine',
        dosage: '25-200mcg',
        frequency: 'Once daily',
        duration: 'Long-term with regular monitoring',
        sideEffects: ['Palpitations', 'Insomnia', 'Weight changes']
      },
      {
        name: 'Methimazole',
        dosage: '5-30mg',
        frequency: 'Once or twice daily',
        duration: 'Variable, with regular monitoring',
        sideEffects: ['Rash', 'Joint pain', 'Liver problems']
      }
    ],
    specialist: {
      title: 'Endocrinologist',
      field: 'Endocrinology',
      description: 'A specialist who diagnoses and treats disorders of the endocrine system, including thyroid disorders.',
      recommendedDoctors: doctors['endocrinologist']
    },
    severity: 'moderate'
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
  return potentialMatches.slice(0, 3).map(item => {
    // Add the match percentage to the disease object for display
    return {
      ...item.disease,
      matchPercentage: Math.round(item.score * 100)
    };
  });
};
