
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useTranslation } from 'react-i18next';

interface AudioContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  speakText: (text: string, priority?: boolean) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tts = useTextToSpeech();
  const { i18n } = useTranslation();
  
  // We'll check if HealthBotContext is available and use it if it is
  let healthBotState = null;
  try {
    // Try to import and use HealthBotContext, but don't fail if it's not available
    const { useHealthBot } = require('@/context/HealthBotContext');
    if (typeof useHealthBot === 'function') {
      try {
        const healthBot = useHealthBot();
        healthBotState = healthBot.state;
      } catch (e) {
        // HealthBotProvider not available in current component tree, that's okay
        console.log('HealthBot context not available in current component tree');
      }
    }
  } catch (e) {
    // Module not found or other error, that's okay
    console.log('HealthBot module not available');
  }
  
  // Automatically speak healthbot messages when they arrive
  useEffect(() => {
    if (!tts.isSoundEnabled || !healthBotState || healthBotState.messages?.length === 0) return;
    
    const lastMessage = healthBotState.messages[healthBotState.messages.length - 1];
    
    // Only speak healthbot messages, not user messages
    if (lastMessage.sender === 'healthbot' && !lastMessage.isAnalysis) {
      tts.speakText(lastMessage.text);
    }
    
    // For analysis messages, we speak a simplified version
    if (lastMessage.sender === 'healthbot' && lastMessage.isAnalysis && lastMessage.analysis) {
      const analysis = lastMessage.analysis;
      const { t } = require('react-i18next'); // Import inside effect to avoid issues with changing language
      
      let analysisText = t("I've analyzed your symptoms. ");
      
      if (analysis.possibleDiseases.length > 0) {
        const topDisease = analysis.possibleDiseases[0];
        analysisText += t("The most likely condition is {{name}} with a {{percent}}% match. ", {
          name: topDisease.name,
          percent: topDisease.matchPercentage
        });
        
        analysisText += analysis.recommendation.split('.').slice(0, 2).join('.') + '.';
      } else {
        analysisText += t("I couldn't identify a specific condition based on the symptoms provided. Please add more symptoms or consult a healthcare professional.");
      }
      
      tts.speakText(analysisText);
    }
  }, [healthBotState?.messages, tts, i18n.language]);
  
  return (
    <AudioContext.Provider
      value={{
        isSoundEnabled: tts.isSoundEnabled,
        toggleSound: tts.toggleSound,
        speakText: tts.speakText,
        stopSpeaking: tts.stopSpeaking,
        isSpeaking: tts.isSpeaking
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
