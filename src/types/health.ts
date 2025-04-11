
export type BodyCategory = 
  | 'head' 
  | 'chest' 
  | 'abdomen' 
  | 'limbs' 
  | 'skin' 
  | 'general';

export interface Symptom {
  id: string;
  name: string;
  category: BodyCategory;
  description: string;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  commonSymptoms: string[]; // Array of symptom IDs
  medications: Medication[];
  specialist: Specialist;
  severity: 'mild' | 'moderate' | 'severe';
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
}
