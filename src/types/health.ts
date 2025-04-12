
export type BodyCategory = 
  | 'neurological' 
  | 'respiratory' 
  | 'digestive' 
  | 'musculoskeletal' 
  | 'dermatological' 
  | 'general'
  | 'cardiovascular'
  | 'ent'
  | 'urinary'
  | 'reproductive'
  | 'metabolic';

export interface Symptom {
  id: string;
  name: string;
  category: BodyCategory;
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  photoUrl: string;
  specialty: string;
  hospital: string;
  experience: string;
  licenseNumber: string;
  phone: string;
  bio: string;
  rating: number;
  available: boolean;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  sideEffects: string[];
}

export interface Specialist {
  title: string;
  field: string;
  description: string;
  recommendedDoctors: Doctor[];
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  commonSymptoms: string[]; // Array of symptom IDs
  medications: Medication[];
  specialist: Specialist;
  severity: 'mild' | 'moderate' | 'severe';
  matchPercentage?: number; // Added for display in UI
}

export interface Analysis {
  possibleDiseases: Disease[];
  confidence: number;
  recommendation: string;
}

export type MessageSender = 'user' | 'healthbot';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  isAnalysis?: boolean;
  analysis?: Analysis;
}

export interface HealthBotState {
  messages: Message[];
  selectedSymptoms: Symptom[];
  lastInteractionTime: number | null;
  loading: boolean;
  selectedDisease?: Disease | null;
  viewingDoctors: boolean;
  viewingPrescription: boolean;
  analysis: Analysis | null;
}
