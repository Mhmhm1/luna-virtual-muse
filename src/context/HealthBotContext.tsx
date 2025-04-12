import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Symptom, HealthBotState, Analysis, Disease, Doctor } from '../types/health';
import { symptoms, getSymptomById } from '../data/symptoms';
import { analyzeSymptomsForDiseases } from '../data/diseases';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

type HealthBotContextType = {
  state: HealthBotState;
  setState: React.Dispatch<React.SetStateAction<HealthBotState>>;
  sendMessage: (text: string) => void;
  selectSymptom: (symptom: Symptom) => void;
  removeSymptom: (symptomId: string) => void;
  clearSymptoms: () => void;
  resetConversation: () => void;
  startAnalysis: () => void;
  selectDisease: (disease: Disease) => void;
  viewDoctorsList: (disease: Disease) => void;
  viewPrescription: (disease: Disease) => void;
  saveConversation: () => Promise<void>;
};

const initialState: HealthBotState = {
  messages: [],
  selectedSymptoms: [],
  lastInteractionTime: null,
  loading: false,
  selectedDisease: null,
  viewingDoctors: false,
  viewingPrescription: false,
  analysis: null,
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

  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('healthBotState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: "Hello! I'm your MediAssist Pro assistant. How are you feeling today? Please select your symptoms or describe them to me.",
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [welcomeMessage],
        lastInteractionTime: Date.now()
      }));
    }
  }, []);

  const saveConversation = async (): Promise<void> => {
    if (!user || state.messages.length <= 1) return;
    
    try {
      const messagesJson = state.messages as unknown as Json;
      const symptomsJson = state.selectedSymptoms as unknown as Json;
      const analysisJson = state.analysis as unknown as Json;
      
      const { error } = await supabase
        .from('conversation_history')
        .insert({
          user_id: user.id,
          messages: messagesJson,
          selected_symptoms: symptomsJson,
          analysis: analysisJson
        });
        
      if (error) throw error;
      
      toast({
        title: "Conversation saved",
        description: "Your conversation has been saved to your history.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving conversation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      lastInteractionTime: Date.now(),
      loading: true
    }));
    
    if (!text.includes("I'm experiencing") && !text.includes("Can you analyze these symptoms")) {
      setTimeout(() => {
        processUserMessage(text);
      }, 1000);
    } else {
      setState(prev => ({
        ...prev,
        loading: false
      }));
    }
  };
  
  const processUserMessage = (text: string) => {
    const lowerText = text.toLowerCase();
    const foundSymptoms: Symptom[] = [];
    
    symptoms.forEach(symptom => {
      if (lowerText.includes(symptom.name.toLowerCase()) || 
          lowerText.includes(symptom.id.replace('-', ' '))) {
        if (!state.selectedSymptoms.some(s => s.id === symptom.id)) {
          foundSymptoms.push(symptom);
        }
      }
    });
    
    let responseText = "";
    
    if (foundSymptoms.length > 0) {
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
      if (state.selectedSymptoms.length === 0) {
        responseText = "I don't have any symptoms to analyze yet. Please tell me what symptoms you're experiencing.";
      } else {
        startAnalysis();
        return;
      }
    } else {
      responseText = "I'm not sure if I understood your symptoms correctly. You can search for symptoms or select them from categories using the filters below.";
    }
    
    const botMessage: Message = {
      id: uuidv4(),
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
    if (state.selectedSymptoms.some(s => s.id === symptom.id)) {
      return;
    }
    
    setState(prev => ({
      ...prev,
      selectedSymptoms: [...prev.selectedSymptoms, symptom]
    }));
  };
  
  const removeSymptom = (symptomId: string) => {
    setState(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.filter(s => s.id !== symptomId)
    }));
    
    toast({
      description: "Symptom removed from your list.",
    });
  };
  
  const clearSymptoms = () => {
    setState(prev => ({
      ...prev,
      selectedSymptoms: []
    }));
    
    const botMessage: Message = {
      id: uuidv4(),
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
    if (state.selectedSymptoms.length === 0) {
      const botMessage: Message = {
        id: uuidv4(),
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
      viewingDoctors: false,
      viewingPrescription: false,
      analysis: null
    }));
    
    const analyzingMessage: Message = {
      id: uuidv4(),
      sender: 'healthbot',
      text: "Analyzing your symptoms...",
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, analyzingMessage]
    }));
    
    setTimeout(() => {
      const symptomIds = state.selectedSymptoms.map(s => s.id);
      
      const possibleDiseases = analyzeSymptomsForDiseases(symptomIds);
      
      const diseasesWithPercentages = possibleDiseases.map((disease, index) => {
        const matchingSymptoms = disease.commonSymptoms.filter(id => symptomIds.includes(id));
        const totalSymptoms = disease.commonSymptoms.length;
        const userSymptoms = symptomIds.length;
        
        const matchPercentage = (matchingSymptoms.length / totalSymptoms) * 100;
        const coveragePercentage = (matchingSymptoms.length / userSymptoms) * 100;
        
        const finalPercentage = Math.round((matchPercentage * 0.7) + (coveragePercentage * 0.3));
        
        return {
          ...disease,
          matchPercentage: Math.min(95, Math.max(30, finalPercentage))
        };
      });
      
      diseasesWithPercentages.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
      
      const topMatches = diseasesWithPercentages
        .filter(d => (d.matchPercentage || 0) > 40)
        .slice(0, 2);
      
      const hasMoreMatches = diseasesWithPercentages.filter(d => (d.matchPercentage || 0) > 50).length > 2;
      
      const analysis: Analysis = {
        possibleDiseases: topMatches,
        confidence: topMatches.length > 0 ? (topMatches[0].matchPercentage || 0) / 100 : 0.3,
        recommendation: buildRecommendation(topMatches, state.selectedSymptoms, hasMoreMatches)
      };
      
      const analysisMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: createAnalysisMessageText(topMatches, diseasesWithPercentages.length, hasMoreMatches),
        timestamp: Date.now(),
        isAnalysis: true,
        analysis: analysis
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages.filter(m => m.id !== analyzingMessage.id), analysisMessage],
        loading: false,
        analysis: analysis
      }));
      
      if (user) {
        saveConversation();
      }
    }, 2500);
  };
  
  const createAnalysisMessageText = (topMatches: Disease[], totalMatches: number, hasMoreMatches: boolean): string => {
    if (topMatches.length === 0) {
      return "Based on the symptoms you've provided, I couldn't identify any specific conditions in my database. Please provide more information about your symptoms or consult a healthcare professional for a proper diagnosis.";
    }
    
    if (hasMoreMatches) {
      return `Your symptoms match several possible conditions. To narrow down the possibilities further, please provide more specific details about your symptoms. Based on what you've shared, the most likely conditions are ${topMatches.map(d => d.name).join(' and ')}.`;
    }
    
    if (topMatches.length === 1) {
      const match = topMatches[0];
      const percentage = match.matchPercentage || 0;
      return `Based on your symptoms, there's a ${percentage}% match with ${match.name}. ${match.description} Would you like to see more details or recommended specialists?`;
    }
    
    return `Based on your symptoms, I've narrowed it down to two possible conditions: ${topMatches[0].name} (${topMatches[0].matchPercentage}% match) and ${topMatches[1].name} (${topMatches[1].matchPercentage}% match). Would you like to see more details about either of them?`;
  };
  
  const buildRecommendation = (diseases: Disease[], symptoms: Symptom[], hasMoreMatches: boolean): string => {
    if (diseases.length === 0) {
      return "Your symptoms don't clearly match any specific condition in my database. Please consult with a healthcare professional for a proper diagnosis.";
    }
    
    if (hasMoreMatches) {
      return "Your symptoms match several possible conditions. To narrow it down further, please provide more specific information about when your symptoms started, their severity, and any additional symptoms you may have, or consult a healthcare professional.";
    }
    
    if (diseases.length === 1) {
      const disease = diseases[0];
      return `Based on your symptoms, ${disease.name} seems likely. ${disease.description} It's recommended to consult with a ${disease.specialist.title} for proper diagnosis and treatment.`;
    }
    
    return `Based on your symptoms, I've narrowed it down to ${diseases[0].name} and ${diseases[1].name}. To determine which is more likely, a healthcare professional would need to perform additional tests and examinations.`;
  };
  
  const selectDisease = (disease: Disease) => {
    setState(prev => ({
      ...prev,
      selectedDisease: disease,
      viewingDoctors: false,
      viewingPrescription: false
    }));
    
    const detailsMessage: Message = {
      id: uuidv4(),
      sender: 'healthbot',
      text: `I've found more information about ${disease.name}. Would you like to see the prescription details?`,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, detailsMessage]
    }));
  };
  
  const viewPrescription = (disease: Disease) => {
    setState(prev => ({
      ...prev,
      viewingPrescription: true,
      viewingDoctors: false
    }));
    
    const prescriptionMessage: Message = {
      id: uuidv4(),
      sender: 'healthbot',
      text: `Here are the medication details for ${disease.name}. Would you like me to recommend a specialist?`,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, prescriptionMessage]
    }));
  };
  
  const viewDoctorsList = (disease: Disease) => {
    setState(prev => ({
      ...prev,
      viewingDoctors: true
    }));
    
    const doctorsMessage: Message = {
      id: uuidv4(),
      sender: 'healthbot',
      text: `Here are some ${disease.specialist.title} specialists who can help with ${disease.name}.`,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, doctorsMessage]
    }));
    
    if (user) {
      saveConversation();
    }
  };
  
  const resetConversation = () => {
    if (user && state.messages.length > 1) {
      saveConversation();
    }
    
    setState(initialState);
    
    const welcomeMessage: Message = {
      id: uuidv4(),
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
      viewingDoctors: false,
      viewingPrescription: false,
      analysis: null
    });
  };
  
  return (
    <HealthBotContext.Provider 
      value={{ 
        state,
        setState, 
        sendMessage, 
        selectSymptom, 
        removeSymptom, 
        clearSymptoms, 
        resetConversation,
        startAnalysis,
        selectDisease,
        viewDoctorsList,
        viewPrescription,
        saveConversation
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
