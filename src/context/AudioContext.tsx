
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

type AudioContextType = {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>('healthbot-sound-enabled', true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech synthesis when component mounts
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }

    // Clean up function to stop speaking when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Ensure voices are loaded
  useEffect(() => {
    if (!speechSynthesis) return;
    
    // Check if voices are already loaded
    if (speechSynthesis.getVoices().length === 0) {
      // Set up event listener for when voices change (become available)
      const voicesChangedHandler = () => {
        // Just trigger a re-render when voices are loaded
        setSpeechSynthesis(window.speechSynthesis);
      };
      
      speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
      };
    }
  }, [speechSynthesis]);

  const toggleSound = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setIsSoundEnabled(!isSoundEnabled);
    toast({
      description: !isSoundEnabled ? "Sound notifications enabled" : "Sound notifications disabled",
    });
  };

  const speakText = (text: string) => {
    if (!isSoundEnabled || !speechSynthesis) return;
    
    // Stop any current speech
    stopSpeaking();
    
    try {
      const newUtterance = new SpeechSynthesisUtterance(text);
      setUtterance(newUtterance);
      
      // Configure voice settings
      newUtterance.rate = 1.0; // Speed of speech
      newUtterance.pitch = 1.0; // Pitch of voice
      newUtterance.volume = 1.0; // Volume
      
      // Find a female voice if available
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('woman') || 
        voice.name.includes('girl') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Google UK English Female')
      );
      
      if (femaleVoice) {
        newUtterance.voice = femaleVoice;
      }
      
      // Event handlers
      newUtterance.onstart = () => setIsSpeaking(true);
      newUtterance.onend = () => {
        setIsSpeaking(false);
        setUtterance(null);
      };
      newUtterance.onerror = (event) => {
        console.error('TTS Error:', event);
        setIsSpeaking(false);
        setUtterance(null);
      };
      
      // Speak the text
      speechSynthesis.speak(newUtterance);
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
      setUtterance(null);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setUtterance(null);
    }
  };

  return (
    <AudioContext.Provider value={{ 
      isSoundEnabled, 
      toggleSound, 
      speakText, 
      stopSpeaking,
      isSpeaking
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
