
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Symptom, HealthBotState, Analysis } from '../types/health';
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
};

const initialState: HealthBotState = {
  messages: [],
  selectedSymptoms: [],
  lastInteractionTime: null,
  loading: false,
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
        text: "Hello! I'm your health assistant. I can help analyze your symptoms and provide potential causes and recommendations. Please select your symptoms or type them out. Note: This is not a substitute for professional medical advice.",
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
      loading: true
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
      
      // Create analysis object
      const analysis: Analysis = {
        possibleDiseases,
        confidence: possibleDiseases.length > 0 ? 0.7 : 0.3,
        recommendation: possibleDiseases.length > 0 
          ? "Based on your symptoms, you should consider consulting a healthcare professional." 
          : "Your symptoms don't clearly match any specific condition in my database. Please consult with a healthcare professional for a proper diagnosis."
      };
      
      // Format analysis results
      let analysisText = "";
      
      if (possibleDiseases.length > 0) {
        analysisText = "Based on the symptoms you described, here are some potential conditions that might match your symptoms:\n\n";
        
        possibleDiseases.forEach((disease, index) => {
          analysisText += `${index + 1}. **${disease.name}**\n`;
          analysisText += `${disease.description}\n\n`;
          
          // Add medication info
          analysisText += "Potential treatments include:\n";
          disease.medications.forEach(med => {
            analysisText += `• **${med.name}**: ${med.dosage}, ${med.frequency} for ${med.duration}.\n`;
            analysisText += `  Side effects: ${med.sideEffects.join(', ')}.\n\n`;
          });
          
          // Add specialist recommendation
          analysisText += `**Specialist Recommendation**: ${disease.specialist.title} (${disease.specialist.field})\n`;
          analysisText += `${disease.specialist.description}\n\n`;
        });
        
        analysisText += "**IMPORTANT**: This analysis is not a diagnosis. Please consult with a healthcare professional for proper evaluation and treatment.";
      } else {
        analysisText = "I couldn't find a clear match for your combination of symptoms in my database. This could mean:\n\n";
        analysisText += "1. Your condition might be less common\n";
        analysisText += "2. The combination of symptoms could be related to multiple conditions\n";
        analysisText += "3. More information might be needed for a more accurate analysis\n\n";
        analysisText += "I recommend consulting with a healthcare professional for a proper diagnosis. Would you like to add more symptoms for me to analyze?";
      }
      
      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'healthbot',
        text: analysisText,
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
      loading: false
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
        startAnalysis
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
