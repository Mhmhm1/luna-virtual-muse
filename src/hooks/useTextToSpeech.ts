
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useToast } from './use-toast';

export const useTextToSpeech = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>('healthbot-sound-enabled', true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [preferredVoice, setPreferredVoice] = useLocalStorage<string>('healthbot-preferred-voice', '');
  const { toast } = useToast();

  // Load available voices
  useEffect(() => {
    if (!window.speechSynthesis) return;
    
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    
    // Voice list might be available immediately or after an event
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const toggleSound = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setIsSoundEnabled(!isSoundEnabled);
    toast({
      description: !isSoundEnabled ? "Sound notifications enabled" : "Sound notifications disabled",
    });
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string, priority = false) => {
    if (!isSoundEnabled || !window.speechSynthesis) return;
    
    if (priority) {
      stopSpeaking();
    } else if (isSpeaking) {
      // If already speaking and not priority, don't interrupt
      return;
    }
    
    try {
      const chunks = splitTextIntoChunks(text, 200);
      if (chunks.length === 0) return;
      
      setIsSpeaking(true);
      speakTextChunks(chunks, 0);
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  };

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

  const speakTextChunks = (chunks: string[], index: number) => {
    if (index >= chunks.length) {
      setIsSpeaking(false);
      return;
    }
    
    const chunk = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunk);
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Select voice based on preference
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    
    // Try to use the preferred voice if set
    if (preferredVoice) {
      const savedVoice = voices.find(voice => voice.name === preferredVoice);
      if (savedVoice) {
        utterance.voice = savedVoice;
      }
    }
    
    // Fallback to a female voice if preferred voice not found
    if (!utterance.voice) {
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('woman') || 
        voice.name.includes('girl') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Google UK English Female')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    }
    
    utterance.onend = () => {
      speakTextChunks(chunks, index + 1);
    };
    
    utterance.onerror = (event) => {
      console.error('TTS Error:', event);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const setVoice = (voiceName: string) => {
    setPreferredVoice(voiceName);
    
    // Test the selected voice
    if (isSoundEnabled) {
      const testUtterance = new SpeechSynthesisUtterance("This is how I'll sound with the new voice.");
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === voiceName);
      
      if (selectedVoice) {
        testUtterance.voice = selectedVoice;
        window.speechSynthesis.speak(testUtterance);
      }
    }
  };

  return {
    isSoundEnabled,
    isSpeaking,
    toggleSound,
    speakText,
    stopSpeaking,
    availableVoices,
    preferredVoice,
    setVoice
  };
};
