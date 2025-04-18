import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Symptom, HealthBotState, Disease, Analysis, Medication, Specialist, Doctor } from '../types/health';
import { symptoms, getSymptomById } from '../data/symptoms';
import { useOpenAI } from '@/hooks/useOpenAI';
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
  saveConversation: () => Promise<void>;
  selectDisease: (disease: Disease) => void;
  viewPrescription: (disease: Disease) => void;
  viewDoctorsList: (disease: Disease) => void;
};

const initialState: HealthBotState = {
  messages: [],
  selectedSymptoms: [],
  lastInteractionTime: null,
  loading: false,
  analysis: null,
  selectedDisease: null,
  viewingDoctors: false,
  viewingPrescription: false,
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
  const { generateResponse } = useOpenAI();

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

  const sendMessage = async (text: string) => {
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

    try {
      const response = await generateResponse(
        `The user says: "${text}". If they are describing symptoms, identify them and provide a helpful response. If they are asking about their symptoms, provide educational information.`,
        'gpt-4o',
        'chat'
      );

      const botMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: response,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        loading: false
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        loading: false
      }));
    }
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
  
  const startAnalysis = async () => {
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
      loading: true
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
    
    try {
      const symptomsText = state.selectedSymptoms
        .map(s => `${s.name} (${s.category}): ${s.description}`)
        .join('\n- ');

      const response = await generateResponse(
        `Analyze these symptoms thoroughly and provide a structured response:\n- ${symptomsText}\n\nRemember to follow the exact format with clearly labeled sections for each condition as specified in your instructions.`,
        'gpt-4o',
        'analyze'
      );

      console.log("Analysis response:", response);

      const parsedAnalysis: Analysis = {
        possibleDiseases: extractDiseasesFromResponse(response),
        confidence: 0.85, // Default confidence
        recommendation: "Please consult with a healthcare professional for an accurate diagnosis."
      };

      console.log("Parsed analysis:", parsedAnalysis);

      const analysisMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: response,
        timestamp: Date.now(),
        isAnalysis: true,
        analysis: parsedAnalysis
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages.filter(m => m.id !== analyzingMessage.id), analysisMessage],
        loading: false,
        analysis: parsedAnalysis
      }));

      if (user) {
        saveConversation();
      }
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: "I apologize, but I encountered an error while analyzing your symptoms. Please try again.",
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages.filter(m => m.id !== analyzingMessage.id), errorMessage],
        loading: false
      }));
    }
  };
  
  const extractDiseasesFromResponse = (response: string): Disease[] => {
    console.log("Extracting diseases from:", response);
    const diseases: Disease[] = [];
    const lines = response.split('\n');
    
    let currentDisease: Partial<Disease> | null = null;
    let matchPercentage: number | undefined;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.toLowerCase().includes('condition:')) {
        if (currentDisease?.name && currentDisease?.description) {
          diseases.push({
            id: uuidv4(),
            name: currentDisease.name,
            description: currentDisease.description,
            commonSymptoms: currentDisease.commonSymptoms || [],
            medications: currentDisease.medications || [],
            specialist: currentDisease.specialist || {
              title: 'Specialist',
              field: 'Medicine',
              description: 'Consult with a healthcare professional',
              recommendedDoctors: []
            },
            severity: currentDisease.severity || 'moderate',
            matchPercentage
          });
        }
        
        const nameMatch = line.match(/Condition:\s*([^(]+?)(?:\s*\((\d+)%\s*match\))?/i);
        if (nameMatch) {
          currentDisease = {
            name: nameMatch[1].trim(),
            medications: []
          };
          
          matchPercentage = nameMatch[2] ? parseInt(nameMatch[2]) : 75;
        }
      }
      
      if (currentDisease && line.toLowerCase().includes('description:')) {
        currentDisease.description = line.substring(line.indexOf(':') + 1).trim();
        
        let nextLine = i + 1;
        while (nextLine < lines.length && 
              !lines[nextLine].includes(':') && 
              lines[nextLine].trim() !== '') {
          currentDisease.description += ' ' + lines[nextLine].trim();
          nextLine++;
          i = nextLine - 1;
        }
      }
      
      if (currentDisease && (line.toLowerCase().includes('common symptoms:') || line.toLowerCase().includes('symptoms:'))) {
        currentDisease.commonSymptoms = [];
        
        let nextLine = i + 1;
        while (nextLine < lines.length && 
               !lines[nextLine].includes(':') && 
               lines[nextLine].trim() !== '') {
          const symptom = lines[nextLine].replace(/^[-•*]\s*/, '').trim();
          if (symptom) currentDisease.commonSymptoms.push(symptom);
          nextLine++;
          i = nextLine - 1;
        }
      }
      
      if (currentDisease && line.toLowerCase().includes('severity:')) {
        const severityText = line.substring(line.indexOf(':') + 1).trim().toLowerCase();
        
        if (severityText.includes('mild')) {
          currentDisease.severity = 'mild';
        } else if (severityText.includes('severe')) {
          currentDisease.severity = 'severe';
        } else {
          currentDisease.severity = 'moderate';
        }
      }
    }
    
    if (currentDisease?.name && currentDisease?.description) {
      diseases.push({
        id: uuidv4(),
        name: currentDisease.name,
        description: currentDisease.description,
        commonSymptoms: currentDisease.commonSymptoms || [],
        medications: currentDisease.medications || [],
        specialist: currentDisease.specialist || {
          title: 'Specialist',
          field: 'Medicine',
          description: 'Consult with a healthcare professional',
          recommendedDoctors: []
        },
        severity: currentDisease.severity || 'moderate',
        matchPercentage
      });
    }
    
    console.log("Extracted diseases:", diseases);
    return diseases;
  };
  
  const selectDisease = async (disease: Disease) => {
    setState(prev => ({
      ...prev,
      selectedDisease: disease,
      viewingPrescription: false,
      viewingDoctors: false,
      loading: true
    }));
    
    try {
      const detailedPrompt = `Provide detailed information about ${disease.name}, including a concise description, common symptoms, severity level, and the appropriate specialist type who would typically treat this condition.`;
      
      const response = await generateResponse(detailedPrompt, 'gpt-4o', 'analyze');
      
      const botMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `Here's some information about ${disease.name}. Would you like to see the recommended treatment options?`,
        timestamp: Date.now()
      };
      
      const updatedDisease = {
        ...disease,
        ...extractDiseaseDetails(response, disease)
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        selectedDisease: updatedDisease,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false
      }));
      
      const fallbackMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `Here's some information about ${disease.name}. Would you like to see the recommended treatment options?`,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage]
      }));
    }
  };
  
  const extractDiseaseDetails = (response: string, disease: Disease): Partial<Disease> => {
    const lines = response.split('\n');
    const updatedDetails: Partial<Disease> = {};
    
    for (const line of lines) {
      if (line.toLowerCase().includes('description:') || line.toLowerCase().includes('overview:')) {
        const description = line.split(':')[1]?.trim();
        if (description && description.length > disease.description.length) {
          updatedDetails.description = description;
        }
      }
    }
    
    const symptomsLine = lines.find(line => 
      line.toLowerCase().includes('symptoms:') || line.toLowerCase().includes('common symptoms:'));
    
    if (symptomsLine) {
      const symptomsIndex = lines.indexOf(symptomsLine);
      const symptomsList: string[] = [];
      
      let i = symptomsIndex + 1;
      while (i < lines.length && 
            !lines[i].includes(':') && 
            lines[i].trim() !== '') {
        const symptom = lines[i].replace(/^[-•*]\s*/, '').trim();
        if (symptom) symptomsList.push(symptom);
        i++;
      }
      
      if (symptomsList.length > 0) {
        updatedDetails.commonSymptoms = symptomsList;
      }
    }
    
    return updatedDetails;
  };
  
  const viewPrescription = async (disease: Disease) => {
    setState(prev => ({
      ...prev,
      selectedDisease: disease,
      viewingPrescription: true,
      viewingDoctors: false,
      loading: true
    }));
    
    try {
      const prescriptionPrompt = `Generate medication information for treating ${disease.name}. 
Include 2-3 medications with detailed information about dosage, frequency, duration, and side effects.
Remember to follow the exact format specified in your instructions with clearly labeled sections.`;
      
      const response = await generateResponse(prescriptionPrompt, 'gpt-4o', 'prescription');
      
      const medications = extractMedicationsFromResponse(response);
      
      const updatedDisease = {
        ...disease,
        medications
      };
      
      const botMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `Here are the medication details for treating ${disease.name}. Would you like to see specialists who can help with this condition?`,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        selectedDisease: updatedDisease,
        loading: false
      }));
    } catch (error) {
      console.error("Error getting prescription:", error);
      setState(prev => ({
        ...prev,
        loading: false
      }));
      
      const fallbackMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `I couldn't retrieve detailed medication information for ${disease.name} at this time. Would you like to see specialists who can help with this condition instead?`,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage]
      }));
    }
  };
  
  const extractMedicationsFromResponse = (response: string): Medication[] => {
    console.log("Extracting medications from:", response);
    const medications: Medication[] = [];
    const lines = response.split('\n');
    
    let currentMedication: Partial<Medication> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.toLowerCase().includes('medication') || line.match(/^- name:/i)) {
        if (currentMedication?.name) {
          medications.push({
            name: currentMedication.name,
            dosage: currentMedication.dosage || 'As prescribed',
            frequency: currentMedication.frequency || 'As directed',
            duration: currentMedication.duration || 'As prescribed',
            sideEffects: currentMedication.sideEffects || ['Consult a doctor for side effects']
          });
        }
        
        currentMedication = {};
      }
      
      if (currentMedication && line.toLowerCase().includes('- name:')) {
        currentMedication.name = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentMedication && line.toLowerCase().includes('- dosage:')) {
        currentMedication.dosage = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentMedication && line.toLowerCase().includes('- frequency:')) {
        currentMedication.frequency = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentMedication && line.toLowerCase().includes('- duration:')) {
        currentMedication.duration = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentMedication && line.toLowerCase().includes('- side effects:')) {
        currentMedication.sideEffects = [];
        
        let nextLine = i + 1;
        while (nextLine < lines.length && 
               !lines[nextLine].includes('- ') && 
               lines[nextLine].trim() !== '') {
          const effect = lines[nextLine].replace(/^[*•]\s*/, '').trim();
          if (effect) currentMedication.sideEffects.push(effect);
          nextLine++;
          i = nextLine - 1;
        }
      }
    }
    
    if (currentMedication?.name) {
      medications.push({
        name: currentMedication.name,
        dosage: currentMedication.dosage || 'As prescribed',
        frequency: currentMedication.frequency || 'As directed',
        duration: currentMedication.duration || 'As prescribed',
        sideEffects: currentMedication.sideEffects || ['Consult a doctor for side effects']
      });
    }
    
    return medications;
  };
  
  const viewDoctorsList = async (disease: Disease) => {
    setState(prev => ({
      ...prev,
      selectedDisease: disease,
      viewingDoctors: true,
      viewingPrescription: false,
      loading: true
    }));
    
    try {
      const doctorsPrompt = `Generate detailed information for 3-4 specialists who treat ${disease.name}. 
Follow the exact structured format specified in your instructions with clearly labeled fields for each specialist.`;
      
      const response = await generateResponse(doctorsPrompt, 'gpt-4o', 'doctor');
      
      const doctors = extractDoctorsFromResponse(response);
      
      const updatedDisease = {
        ...disease,
        specialist: {
          title: `${disease.name} Specialists`,
          field: disease.name,
          description: `These medical professionals specialize in treating ${disease.name} and related conditions`,
          recommendedDoctors: doctors
        }
      };
      
      const botMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `Here are specialists who can help with ${disease.name}. I recommend consulting with a healthcare professional for proper diagnosis and treatment.`,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        selectedDisease: updatedDisease,
        loading: false
      }));
    } catch (error) {
      console.error("Error getting doctors:", error);
      setState(prev => ({
        ...prev,
        loading: false
      }));
      
      const fallbackMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `I couldn't retrieve specialist information for ${disease.name} at this time. Please try again later or consult your healthcare provider for referrals.`,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage]
      }));
    }
  };
  
  const extractDoctorsFromResponse = (response: string): Doctor[] => {
    console.log("Extracting doctors from:", response);
    const doctors: Doctor[] = [];
    const lines = response.split('\n');
    
    let currentDoctor: Partial<Doctor> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.toLowerCase().includes('specialist') || line.match(/^- name:/i)) {
        if (currentDoctor?.name) {
          doctors.push({
            id: uuidv4(),
            name: currentDoctor.name,
            photoUrl: currentDoctor.photoUrl || '/assets/doctor-placeholder.png',
            specialty: currentDoctor.specialty || 'General Medicine',
            hospital: currentDoctor.hospital || 'Medical Center',
            experience: currentDoctor.experience || '15+ years',
            licenseNumber: currentDoctor.licenseNumber || `MD${Math.floor(Math.random() * 100000)}`,
            phone: currentDoctor.phone || '+1-800-DOCTORS',
            bio: currentDoctor.bio || 'Experienced medical professional',
            rating: currentDoctor.rating || 4.5,
            available: currentDoctor.available !== false
          });
        }
        
        currentDoctor = {};
      }
      
      if (currentDoctor && line.toLowerCase().includes('- name:')) {
        currentDoctor.name = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentDoctor && line.toLowerCase().includes('- specialty:')) {
        currentDoctor.specialty = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentDoctor && line.toLowerCase().includes('- hospital:')) {
        currentDoctor.hospital = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentDoctor && line.toLowerCase().includes('- experience:')) {
        currentDoctor.experience = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentDoctor && line.toLowerCase().includes('- bio:')) {
        currentDoctor.bio = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentDoctor && line.toLowerCase().includes('- rating:')) {
        const ratingStr = line.substring(line.indexOf(':') + 1).trim();
        currentDoctor.rating = parseFloat(ratingStr) || 4.5;
      }
      
      if (currentDoctor && line.toLowerCase().includes('- available:')) {
        const availableStr = line.substring(line.indexOf(':') + 1).trim().toLowerCase();
        currentDoctor.available = availableStr === 'yes' || availableStr === 'true';
      }
      
      if (currentDoctor && line.toLowerCase().includes('- phone:')) {
        currentDoctor.phone = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentDoctor && line.toLowerCase().includes('- license:')) {
        currentDoctor.licenseNumber = line.substring(line.indexOf(':') + 1).trim();
      }
      
      if (currentDoctor && line.toLowerCase().includes('- photo:')) {
        currentDoctor.photoUrl = line.substring(line.indexOf(':') + 1).trim() || '/assets/doctor-placeholder.png';
      }
    }
    
    if (currentDoctor?.name) {
      doctors.push({
        id: uuidv4(),
        name: currentDoctor.name,
        photoUrl: currentDoctor.photoUrl || '/assets/doctor-placeholder.png',
        specialty: currentDoctor.specialty || 'General Medicine',
        hospital: currentDoctor.hospital || 'Medical Center',
        experience: currentDoctor.experience || '15+ years',
        licenseNumber: currentDoctor.licenseNumber || `MD${Math.floor(Math.random() * 100000)}`,
        phone: currentDoctor.phone || '+1-800-DOCTORS',
        bio: currentDoctor.bio || 'Experienced medical professional',
        rating: currentDoctor.rating || 4.5,
        available: currentDoctor.available !== false
      });
    }
    
    return doctors;
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
      analysis: null,
      selectedDisease: null,
      viewingDoctors: false,
      viewingPrescription: false
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
        saveConversation,
        selectDisease,
        viewPrescription,
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
