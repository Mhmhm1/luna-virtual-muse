
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
      // Use the 'chat' mode for general conversation
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

      // Use the 'analyze' mode for symptom analysis
      const response = await generateResponse(
        `Analyze these symptoms thoroughly:\n- ${symptomsText}\n\nProvide a detailed analysis including possible conditions with match percentages, descriptions, and recommendations.`,
        'gpt-4o',
        'analyze'
      );

      // Create a simplified analysis object from the response
      const parsedAnalysis: Analysis = {
        possibleDiseases: extractDiseasesFromResponse(response),
        confidence: 0.85, // Default confidence
        recommendation: "Please consult with a healthcare professional for an accurate diagnosis."
      };

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
  
  // Helper function to extract diseases from the AI response
  const extractDiseasesFromResponse = (response: string): Disease[] => {
    // This is a simple parser, in a real system you might want to 
    // have the AI return structured JSON instead
    const diseases: Disease[] = [];
    const lines = response.split('\n');
    
    let currentDisease: Partial<Disease> | null = null;
    let matchPercentage: number | undefined;
    
    for (const line of lines) {
      // Look for disease names with percentages like "Condition: Migraine (85% match)"
      const diseaseMatch = line.match(/([^:]+?)(?:\s*\((\d+)%\s*match\))?:?/i);
      
      if (diseaseMatch && (line.includes('Condition:') || line.toLowerCase().includes('possible condition'))) {
        // Save previous disease if it exists
        if (currentDisease?.name && currentDisease?.description) {
          diseases.push({
            id: uuidv4(),
            name: currentDisease.name,
            description: currentDisease.description,
            commonSymptoms: currentDisease.commonSymptoms || [],
            medications: [],
            specialist: {
              title: 'Specialist',
              field: 'Medicine',
              description: 'Consult with a healthcare professional',
              recommendedDoctors: []
            },
            severity: currentDisease.severity || 'moderate',
            matchPercentage
          });
        }
        
        // Start new disease
        currentDisease = {
          name: diseaseMatch[1].trim()
        };
        
        matchPercentage = diseaseMatch[2] ? parseInt(diseaseMatch[2]) : undefined;
      }
      
      // Look for description
      if (currentDisease && !currentDisease.description && 
         (line.toLowerCase().includes('description:') || line.toLowerCase().includes('overview:'))) {
        currentDisease.description = line.split(':')[1]?.trim() || '';
        
        // Sometimes the description spans multiple lines
        let i = lines.indexOf(line) + 1;
        while (i < lines.length && 
              !lines[i].includes(':') && 
              !lines[i].includes('Symptoms') && 
              lines[i].trim() !== '') {
          currentDisease.description += ' ' + lines[i].trim();
          i++;
        }
      }
      
      // Look for symptoms
      if (currentDisease && line.toLowerCase().includes('symptoms:') || 
         line.toLowerCase().includes('common symptoms:')) {
        const symptomsText = line.split(':')[1]?.trim() || '';
        
        // Extract symptoms from list or comma-separated string
        let symptomsList: string[];
        if (symptomsText) {
          // Already on this line
          symptomsList = symptomsText.split(/,|\n/).map(s => s.trim()).filter(Boolean);
        } else {
          // Symptoms might be listed on subsequent lines
          symptomsList = [];
          let i = lines.indexOf(line) + 1;
          while (i < lines.length && 
                !lines[i].includes(':') && 
                !lines[i].includes('Severity') && 
                lines[i].trim() !== '') {
            // Check if it's a list item
            const symptom = lines[i].replace(/^[-•*]\s*/, '').trim();
            if (symptom) symptomsList.push(symptom);
            i++;
          }
        }
        
        currentDisease.commonSymptoms = symptomsList;
      }
      
      // Look for severity
      if (currentDisease && line.toLowerCase().includes('severity:')) {
        const severityText = line.split(':')[1]?.trim().toLowerCase() || '';
        
        if (severityText.includes('mild')) {
          currentDisease.severity = 'mild';
        } else if (severityText.includes('severe')) {
          currentDisease.severity = 'severe';
        } else {
          currentDisease.severity = 'moderate';
        }
      }
    }
    
    // Don't forget to add the last disease
    if (currentDisease?.name && currentDisease?.description) {
      diseases.push({
        id: uuidv4(),
        name: currentDisease.name,
        description: currentDisease.description,
        commonSymptoms: currentDisease.commonSymptoms || [],
        medications: [],
        specialist: {
          title: 'Specialist',
          field: 'Medicine',
          description: 'Consult with a healthcare professional',
          recommendedDoctors: []
        },
        severity: currentDisease.severity || 'moderate',
        matchPercentage
      });
    }
    
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
      // Get more detailed information about the disease
      const detailedPrompt = `Provide detailed information about ${disease.name}, including a concise description, common symptoms, severity level, and the appropriate specialist type who would typically treat this condition.`;
      
      const response = await generateResponse(detailedPrompt, 'gpt-4o', 'analyze');
      
      const botMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `Here's some information about ${disease.name}. Would you like to see the recommended treatment options?`,
        timestamp: Date.now()
      };
      
      // Update the disease object with more detailed information
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
      
      // Still show basic disease info even if detailed fetch fails
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
  
  // Helper function to extract more disease details
  const extractDiseaseDetails = (response: string, disease: Disease): Partial<Disease> => {
    // Extract any additional information from response
    const lines = response.split('\n');
    const updatedDetails: Partial<Disease> = {};
    
    // Try to extract a better description
    for (const line of lines) {
      if (line.toLowerCase().includes('description:') || line.toLowerCase().includes('overview:')) {
        const description = line.split(':')[1]?.trim();
        if (description && description.length > disease.description.length) {
          updatedDetails.description = description;
        }
      }
    }
    
    // Add more symptoms if found
    const symptomsLine = lines.find(line => 
      line.toLowerCase().includes('symptoms:') || line.toLowerCase().includes('common symptoms:'));
    
    if (symptomsLine) {
      const symptomsIndex = lines.indexOf(symptomsLine);
      const symptomsList: string[] = [];
      
      let i = symptomsIndex + 1;
      while (i < lines.length && 
            !lines[i].includes(':') && 
            lines[i].trim() !== '') {
        // Check if it's a list item
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
      // Get prescription information using the 'prescription' mode
      const prescriptionPrompt = `Generate medication information for treating ${disease.name}. Include dosage, frequency, duration, and side effects for each medication.`;
      
      const response = await generateResponse(prescriptionPrompt, 'gpt-4o', 'prescription');
      
      // Parse the medications from the response
      const medications = extractMedicationsFromResponse(response);
      
      // Create updated disease object with medications
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
      setState(prev => ({
        ...prev,
        loading: false
      }));
      
      // Fallback in case of error
      const fallbackMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `Here are the medication details for treating ${disease.name}. Would you like to see specialists who can help with this condition?`,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage]
      }));
    }
  };
  
  // Helper function to extract medications from the AI response
  const extractMedicationsFromResponse = (response: string): Medication[] => {
    const medications: Medication[] = [];
    const lines = response.split('\n');
    
    let currentMedication: Partial<Medication> | null = null;
    
    for (const line of lines) {
      // Look for medication names usually at the start of a section
      const medNameMatch = line.match(/^[0-9.]?\s*([\w\s-]+?)(?:\(|\:| -)/);
      
      if (medNameMatch && !line.toLowerCase().includes('disclaimer') && !line.toLowerCase().includes('note:')) {
        // Save previous medication if it exists
        if (currentMedication?.name && currentMedication?.dosage) {
          medications.push({
            name: currentMedication.name,
            dosage: currentMedication.dosage,
            frequency: currentMedication.frequency || 'As directed',
            duration: currentMedication.duration || 'As prescribed',
            sideEffects: currentMedication.sideEffects || ['Consult a doctor for side effects']
          });
        }
        
        // Start new medication
        currentMedication = {
          name: medNameMatch[1].trim()
        };
      }
      
      // Look for dosage
      if (currentMedication && 
         (line.toLowerCase().includes('dosage:') || line.toLowerCase().includes('dosing:') || 
          line.toLowerCase().includes('dose:'))) {
        currentMedication.dosage = line.split(':')[1]?.trim() || 'As prescribed';
      }
      
      // Look for frequency
      if (currentMedication && line.toLowerCase().includes('frequency:')) {
        currentMedication.frequency = line.split(':')[1]?.trim() || 'As directed';
      } else if (currentMedication && !currentMedication.frequency && line.toLowerCase().includes('take')) {
        currentMedication.frequency = line.trim();
      }
      
      // Look for duration
      if (currentMedication && line.toLowerCase().includes('duration:')) {
        currentMedication.duration = line.split(':')[1]?.trim() || 'As prescribed';
      }
      
      // Look for side effects
      if (currentMedication && 
         (line.toLowerCase().includes('side effects:') || line.toLowerCase().includes('side-effects:'))) {
        const sideEffectsText = line.split(':')[1]?.trim() || '';
        
        // Extract side effects
        if (sideEffectsText) {
          // Already on this line
          currentMedication.sideEffects = sideEffectsText.split(/,|;/).map(s => s.trim()).filter(Boolean);
        } else {
          // Side effects might be listed on subsequent lines
          const sideEffects: string[] = [];
          let i = lines.indexOf(line) + 1;
          while (i < lines.length && 
                !lines[i].includes(':') && 
                !lines[i].toLowerCase().includes('precaution') && 
                lines[i].trim() !== '') {
            // Check if it's a list item
            const effect = lines[i].replace(/^[-•*]\s*/, '').trim();
            if (effect) sideEffects.push(effect);
            i++;
          }
          
          if (sideEffects.length > 0) {
            currentMedication.sideEffects = sideEffects;
          }
        }
      }
    }
    
    // Don't forget to add the last medication
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
      loading: true
    }));
    
    try {
      // Get doctors information using the 'doctor' mode
      const doctorsPrompt = `Generate information for specialists who treat ${disease.name}. Include name, specialty, hospital, experience, and contact information.`;
      
      const response = await generateResponse(doctorsPrompt, 'gpt-4o', 'doctor');
      
      // Parse the doctors from the response
      const doctors = extractDoctorsFromResponse(response);
      
      // Create updated disease object with specialist info
      const updatedDisease = {
        ...disease,
        specialist: {
          title: 'Specialists',
          field: disease.name,
          description: `These specialists are experienced in treating ${disease.name}`,
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
      setState(prev => ({
        ...prev,
        loading: false
      }));
      
      // Fallback message in case of error
      const fallbackMessage: Message = {
        id: uuidv4(),
        sender: 'healthbot',
        text: `Here are specialists who can help with ${disease.name}. I recommend consulting with a healthcare professional for proper diagnosis and treatment.`,
        timestamp: Date.now()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage]
      }));
    }
  };
  
  // Helper function to extract doctors from the AI response
  const extractDoctorsFromResponse = (response: string): Doctor[] => {
    const doctors: Doctor[] = [];
    const lines = response.split('\n');
    
    let currentDoctor: Partial<Doctor> | null = null;
    
    for (const line of lines) {
      // Look for doctor names (usually at the start of sections)
      const doctorNameMatch = line.match(/^[0-9.]?\s*(Dr\.\s*[\w\s.-]+)(?:\(|\:| -)/);
      
      if (doctorNameMatch) {
        // Save previous doctor if it exists
        if (currentDoctor?.name && currentDoctor?.specialty) {
          doctors.push({
            id: uuidv4(),
            name: currentDoctor.name,
            photoUrl: currentDoctor.photoUrl || '/assets/doctor-placeholder.png',
            specialty: currentDoctor.specialty,
            hospital: currentDoctor.hospital || 'Medical Center',
            experience: currentDoctor.experience || '15+ years',
            licenseNumber: currentDoctor.licenseNumber || `MD${Math.floor(Math.random() * 100000)}`,
            phone: currentDoctor.phone || '+1-800-DOCTORS',
            bio: currentDoctor.bio || 'Experienced medical professional',
            rating: currentDoctor.rating || 4.5,
            available: true
          });
        }
        
        // Start new doctor
        currentDoctor = {
          name: doctorNameMatch[1].trim()
        };
      }
      
      // Extract specialty
      if (currentDoctor && (line.toLowerCase().includes('specialty:') || line.toLowerCase().includes('specialization:'))) {
        currentDoctor.specialty = line.split(':')[1]?.trim() || 'General Medicine';
      }
      
      // Extract hospital/clinic
      if (currentDoctor && 
         (line.toLowerCase().includes('hospital:') || line.toLowerCase().includes('clinic:') || 
          line.toLowerCase().includes('affiliation:'))) {
        currentDoctor.hospital = line.split(':')[1]?.trim() || 'Medical Center';
      }
      
      // Extract experience
      if (currentDoctor && line.toLowerCase().includes('experience:')) {
        currentDoctor.experience = line.split(':')[1]?.trim() || '15+ years';
      }
      
      // Extract bio/background
      if (currentDoctor && 
         (line.toLowerCase().includes('background:') || line.toLowerCase().includes('bio:') || 
          line.toLowerCase().includes('about:'))) {
        currentDoctor.bio = line.split(':')[1]?.trim() || '';
        
        // Sometimes the bio spans multiple lines
        let i = lines.indexOf(line) + 1;
        while (i < lines.length && 
              !lines[i].includes(':') && 
              !lines[i].includes('Dr.') && 
              lines[i].trim() !== '') {
          currentDoctor.bio += ' ' + lines[i].trim();
          i++;
        }
      }
    }
    
    // Don't forget to add the last doctor
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
        available: true
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
