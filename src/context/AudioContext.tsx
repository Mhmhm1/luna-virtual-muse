
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
      // Break down long text into manageable chunks to prevent browser issues
      const textChunks = splitTextIntoChunks(text, 200);
      
      if (textChunks.length === 0) return;
      
      setIsSpeaking(true);
      
      // Process each chunk sequentially
      speakTextChunks(textChunks, 0, speechSynthesis);
      
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  };
  
  // Helper function to split text into chunks
  const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        
        // If a single sentence is longer than maxLength, split it further
        if (sentence.length > maxLength) {
          const words = sentence.split(' ');
          let tempChunk = '';
          
          for (const word of words) {
            if (tempChunk.length + word.length + 1 > maxLength) {
              chunks.push(tempChunk.trim());
              tempChunk = word;
            } else {
              tempChunk += ' ' + word;
            }
          }
          
          if (tempChunk) {
            currentChunk = tempChunk;
          }
        } else {
          currentChunk = sentence;
        }
      } else {
        currentChunk += ' ' + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  };
  
  // Function to speak text chunks sequentially
  const speakTextChunks = (chunks: string[], index: number, synth: SpeechSynthesis) => {
    if (index >= chunks.length) {
      setIsSpeaking(false);
      return;
    }
    
    const chunk = chunks[index];
    const newUtterance = new SpeechSynthesisUtterance(chunk);
    setUtterance(newUtterance);
    
    // Configure voice settings
    newUtterance.rate = 1.0; // Speed of speech
    newUtterance.pitch = 1.0; // Pitch of voice
    newUtterance.volume = 1.0; // Volume
    
    // Find a female voice if available
    const voices = synth.getVoices();
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
    newUtterance.onend = () => {
      // Move to the next chunk when this one is done
      speakTextChunks(chunks, index + 1, synth);
    };
    
    newUtterance.onerror = (event) => {
      console.error('TTS Error:', event);
      setIsSpeaking(false);
    };
    
    // Speak the text
    synth.speak(newUtterance);
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
