
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LunaState, Message, MoodType, UserPreference } from '../types/luna';
import { generateResponse, extractPreferences, generateConversationStarter } from '../utils/lunaResponses';

type LunaContextType = {
  state: LunaState;
  sendMessage: (text: string) => void;
  setMood: (mood: MoodType) => void;
  setUserName: (name: string) => void;
  resetConversation: () => void;
  lunaStartConversation: () => void;
};

const initialState: LunaState = {
  currentMood: 'chill',
  messages: [],
  preferences: [],
  userName: '',
  lastInteractionTime: null,
};

const LunaContext = createContext<LunaContextType | undefined>(undefined);

export const LunaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LunaState>(() => {
    const savedState = localStorage.getItem('lunaState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('lunaState', JSON.stringify(state));
  }, [state]);

  // Check for inactivity and potentially start a conversation
  useEffect(() => {
    // Only start initiating conversations after some messages have been exchanged
    if (state.messages.length < 3) return;
    
    const inactivityCheckInterval = setInterval(() => {
      const lastInteraction = state.lastInteractionTime || Date.now();
      const hoursPassed = (Date.now() - lastInteraction) / (1000 * 60 * 60);
      
      // If it's been more than 8 hours and we have a 5% chance, Luna initiates a conversation
      if (hoursPassed > 8 && Math.random() < 0.05) {
        lunaStartConversation();
      }
    }, 1000 * 60 * 30); // Check every 30 minutes
    
    return () => clearInterval(inactivityCheckInterval);
  }, [state.messages.length, state.lastInteractionTime]);

  // Function for Luna to start a conversation
  const lunaStartConversation = () => {
    const lunaMessage: Message = {
      id: Date.now().toString(),
      sender: 'luna',
      text: generateConversationStarter(state.currentMood, state.userName),
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, lunaMessage],
      lastInteractionTime: Date.now()
    }));
  };

  const sendMessage = (text: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    
    // Extract potential preferences from the message
    const newPreferences = extractPreferences(text);
    const prefsToAdd: UserPreference[] = Object.entries(newPreferences).map(
      ([name, value]) => ({ name, value })
    );
    
    // Update Luna state with the user message
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      preferences: [...prev.preferences, ...prefsToAdd],
      lastInteractionTime: Date.now()
    }));
    
    // Extract name if Luna doesn't know it yet and user introduces themselves
    if (!state.userName) {
      const nameMatch = text.match(/my name is (\w+)/i) || 
                        text.match(/I'm (\w+)/i) || 
                        text.match(/I am (\w+)/i);
      
      if (nameMatch && nameMatch[1]) {
        setState(prev => ({
          ...prev,
          userName: nameMatch[1]
        }));
      }
    }
    
    // Set a delay to make Luna's response seem more natural
    setTimeout(() => {
      // Generate Luna's response
      const lunaResponse = generateResponse(
        state.currentMood, 
        [...state.messages, userMessage],
        state.userName
      );
      
      const lunaMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'luna',
        text: lunaResponse,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, lunaMessage]
      }));
    }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
  };
  
  const setMood = (mood: MoodType) => {
    setState(prev => ({
      ...prev,
      currentMood: mood
    }));
  };
  
  const setUserName = (name: string) => {
    setState(prev => ({
      ...prev,
      userName: name
    }));
  };
  
  const resetConversation = () => {
    setState({
      ...initialState,
      userName: state.userName, // preserve the username
      currentMood: state.currentMood // preserve the current mood
    });
  };
  
  return (
    <LunaContext.Provider 
      value={{ 
        state, 
        sendMessage, 
        setMood, 
        setUserName, 
        resetConversation,
        lunaStartConversation
      }}
    >
      {children}
    </LunaContext.Provider>
  );
};

export const useLuna = () => {
  const context = useContext(LunaContext);
  if (context === undefined) {
    throw new Error('useLuna must be used within a LunaProvider');
  }
  return context;
};
