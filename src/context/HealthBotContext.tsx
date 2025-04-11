
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Symptom, HealthBotState, Analysis, Disease, Doctor } from '../types/health';
import { symptoms, getSymptomById } from '../data/symptoms';
import { analyzeSymptomsForDiseases } from '../data/diseases';

type HealthBotContextType = {
  state: HealthBotState;
  sendMessage: (text: string) => void;
  selectSymptom: (symptom: Symptom) => void;
  removeSymptom: (symptomId: string) => void;
  clearSymptoms: () => void;
  resetConversation: () => void;
  startAnalysis: () => void;
  selectDisease: (disease: Disease) => void;
  viewDoctorsList: (disease: Disease) => void;
};

const initialState: HealthBotState = {
  messages: [],
  selectedSymptoms: [],
  lastInteractionTime: null,
  loading: false,
  selectedDisease: null,
  viewingDoctors: false,
};

const HealthBotContext = createContext<HealthBotContextType | undefined>(undefined);

export const HealthBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HealthBotState>(() => {
    const savedState = localStorage.getItem('healthBotState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error("Error parsing saved HealthBot state:", e);
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('healthBotState', JSON.stringify(state));
  }, [state]);

  // Add welcome message on first load
  useEffect(() => {
    if (state.messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        sender: 'healthbot',
        text: "Hello! I'm your MediAssist Pro assistant. I can help analyze your symptoms and provide potential causes, medications, and specialist recommendations. Please select your symptoms using the categories below or type them out. Remember: This is not a substitute for professional medical advice.",
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [welcomeMessage],
        lastInteractionTime: Date.now()
      }));
    }
  }, []);

  const sendMessage = (text: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    
    // Update state with the user message
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      lastInteractionTime: Date.now(),
      loading: true
    }));
    
    // Process the message to look for symptoms
    setTimeout(() => {
      processUserMessage(text);
    }, 1000);
  };
  
  const processUserMessage = (text: string) => {
    // Simple symptom extraction from text
    const lowerText = text.toLowerCase();
    const foundSymptoms: Symptom[] = [];
    
    // Check if any known symptom is mentioned in the text
    symptoms.forEach(symptom => {
      if (lowerText.includes(symptom.name.toLowerCase()) || 
          lowerText.includes(symptom.id.replace('-', ' '))) {
        // Only add if not already selected
        if (!state.selectedSymptoms.some(s => s.id === symptom.id)) {
          foundSymptoms.push(symptom);
        }
      }
    });
    
    let responseText = "";
    
    if (foundSymptoms.length > 0) {
      // Add found symptoms to selected symptoms
      const newSelectedSymptoms = [...state.selectedSymptoms, ...foundSymptoms];
      
      const symptomNames = foundSymptoms.map(s => s.name).join(', ');
      responseText = `I've identified these symptoms: ${symptomNames}. I've added them to your list. Would you like to mention any other symptoms, or shall we analyze these?`;
      
      setState(prev => ({
        ...prev,
        selectedSymptoms: newSelectedSymptoms,
        loading: false
      }));
    } else if (lowerText.includes('analyze') || 
               lowerText.includes('what') || 
               lowerText.includes('diagnose') || 
               lowerText.includes('assess')) {
      // User wants an analysis
      if (state.selectedSymptoms.length === 0) {
        responseText = "I don't have any symptoms to analyze yet. Please tell me what symptoms you're experiencing.";
      } else {
        // We'll handle analysis in a separate function
        startAnalysis();
        return;
      }
    } else {
      responseText = "I'm not sure if I understood your symptoms correctly. You can select symptoms from the categories below, or try describing them differently.";
    }
    
    // Send bot response
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'healthbot',
      text: responseText,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
      loading: false
    }));
  };
  
  const selectSymptom = (symptom: Symptom) => {
    // Check if already selected
    if (state.selectedSymptoms.some(s => s.id === symptom.id)) {
      return;
    }
    
    setState(prev => ({
      ...prev,
      selectedSymptoms: [...prev.selectedSymptoms, symptom]
    }));
    
    // Add a message about the selection
    const botMessage: Message = {
      id: Date.now().toString(),
      sender: 'healthbot',
      text: `I've added "${symptom.name}" to your symptoms. ${
        state.selectedSymptoms.length === 0 
          ? "Please add more symptoms for better analysis." 
          : "Would you like to add more symptoms or analyze these?"
      }`,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
      lastInteractionTime: Date.now()
    }));
  };
  
  const removeSymptom = (symptomId: string) => {
    setState(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.filter(s => s.id !== symptomId)
    }));
  };
  
  const clearSymptoms = () => {
    setState(prev => ({
      ...prev,
      selectedSymptoms: []
    }));
    
    const botMessage: Message = {
      id: Date.now().toString(),
      sender: 'healthbot',
      text: "I've cleared all your symptoms. When you're ready, please tell me what symptoms you're experiencing.",
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage]
    }));
  };
  
  const startAnalysis = () => {
    // Don't analyze if no symptoms
    if (state.selectedSymptoms.length === 0) {
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'healthbot',
        text: "I need to know your symptoms before I can analyze them. Please add some symptoms first.",
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        loading: false
      }));
      
      return;
    }
    
    setState(prev => ({
      ...prev,
      loading: true,
      selectedDisease: null,
      viewingDoctors: false
    }));
    
    // Add a message to show we're analyzing
    const analyzingMessage: Message = {
      id: Date.now().toString(),
      sender: 'healthbot',
      text: "Analyzing your symptoms...",
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, analyzingMessage]
    }));
    
    // Simulate analysis time for realism
    setTimeout(() => {
      // Get symptom IDs
      const symptomIds = state.selectedSymptoms.map(s => s.id);
      
      // Run analysis
      const possibleDiseases = analyzeSymptomsForDiseases(symptomIds);
      
      // Add match percentages to diseases for display
      const diseasesWithPercentages = possibleDiseases.map((disease, index) => {
        // Calculate a percentage based on position (first is highest)
        const basePercentage = 80 - (index * 15);
        const randomOffset = Math.floor(Math.random() * 10);
        const percentage = Math.min(95, Math.max(30, basePercentage + randomOffset));
        
        return {
          ...disease,
          matchPercentage: percentage
        };
      });
      
      // Create analysis object
      const analysis: Analysis = {
        possibleDiseases: diseasesWithPercentages,
        confidence: diseasesWithPercentages.length > 0 ? 0.7 : 0.3,
        recommendation: diseasesWithPercentages.length > 0 
          ? "Based on your symptoms, you should consider consulting a healthcare professional." 
          : "Your symptoms don't clearly match any specific condition in my database. Please consult with a healthcare professional for a proper diagnosis."
      };
      
      // Create analysis message
      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'healthbot',
        text: "Here's my analysis based on your symptoms.",
        timestamp: Date.now(),
        isAnalysis: true,
        analysis
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages.filter(m => m.id !== analyzingMessage.id), analysisMessage],
        loading: false
      }));
    }, 2500);
  };
  
  const selectDisease = (disease: Disease) => {
    setState(prev => ({
      ...prev,
      selectedDisease: disease,
      viewingDoctors: false
    }));
    
    // Create a special "disease details" message
    const detailsMessage: Message = {
      id: "disease-details", // Special ID to identify this message
      sender: 'healthbot',
      text: "", // Content will be rendered from the component
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, detailsMessage]
    }));
  };
  
  const viewDoctorsList = (disease: Disease) => {
    setState(prev => ({
      ...prev,
      viewingDoctors: true
    }));
    
    // Create a special "doctors list" message
    const doctorsMessage: Message = {
      id: "doctors-list", // Special ID to identify this message
      sender: 'healthbot',
      text: "", // Content will be rendered from the component
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, doctorsMessage]
    }));
  };
  
  const resetConversation = () => {
    setState(initialState);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      sender: 'healthbot',
      text: "Let's start fresh. What symptoms are you experiencing?",
      timestamp: Date.now()
    };
    
    setState({
      messages: [welcomeMessage],
      selectedSymptoms: [],
      lastInteractionTime: Date.now(),
      loading: false,
      selectedDisease: null,
      viewingDoctors: false
    });
  };
  
  return (
    <HealthBotContext.Provider 
      value={{ 
        state, 
        sendMessage, 
        selectSymptom, 
        removeSymptom, 
        clearSymptoms, 
        resetConversation,
        startAnalysis,
        selectDisease,
        viewDoctorsList
      }}
    >
      {children}
    </HealthBotContext.Provider>
  );
};

export const useHealthBot = () => {
  const context = useContext(HealthBotContext);
  if (context === undefined) {
    throw new Error('useHealthBot must be used within a HealthBotProvider');
  }
  return context;
};
