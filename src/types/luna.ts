
export type MoodType = 'flirty' | 'chill' | 'comforting' | 'curious' | 'deep';

export interface Message {
  id: string;
  sender: 'user' | 'luna';
  text: string;
  timestamp: number;
}

export interface UserPreference {
  name: string;
  value: string;
}

export interface LunaState {
  currentMood: MoodType;
  messages: Message[];
  preferences: UserPreference[];
  userName: string;
  lastInteractionTime: number | null;
  recentResponses: string[]; // Track recently used responses to avoid repetition
}
