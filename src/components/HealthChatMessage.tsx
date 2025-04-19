
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/health';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHealthBot } from '@/context/HealthBotContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { UserRound } from 'lucide-react';
import AnalysisMessage from './message/AnalysisMessage';
import DiseaseDetails from './message/DiseaseDetails';
import PrescriptionView from './message/PrescriptionView';
import DoctorsView from './message/DoctorsView';

interface HealthChatMessageProps {
  message: Message;
}

const HealthChatMessage: React.FC<HealthChatMessageProps> = ({ message }) => {
  const { state } = useHealthBot();
  const { speakText, isSoundEnabled } = useTextToSpeech();
  const isHealthBot = message.sender === 'healthbot';
  const hasSpoken = useRef(false);
  
  // Prepare speech text for different message types
  const prepareSpeechText = () => {
    if (!isHealthBot) return '';
    
    let speechText = message.text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (message.isAnalysis && state.analysis && state.analysis.possibleDiseases.length > 0) {
      const diseaseNames = state.analysis.possibleDiseases.map(d => 
        `${d.name} with a ${d.matchPercentage}% match`
      ).join(', ');
      
      speechText += ` Based on your symptoms, I've identified these possible conditions: ${diseaseNames}.`;
    }
    
    if (state.selectedDisease && message.text.includes(`information about ${state.selectedDisease.name}`)) {
      const disease = state.selectedDisease;
      const symptoms = disease.commonSymptoms.join(', ');
      speechText += ` Common symptoms include ${symptoms}. The severity is ${disease.severity}.`;
    }
    
    if (state.selectedDisease && state.viewingPrescription && message.text.includes('medication details')) {
      const medications = state.selectedDisease.medications;
      speechText += ` Recommended medications include: `;
      medications.forEach((med, idx) => {
        speechText += `${med.name}, dosage: ${med.dosage}, to be taken ${med.frequency} for ${med.duration}.`;
        if (idx < medications.length - 1) speechText += ' Also, ';
      });
    }
    
    if (state.selectedDisease && state.viewingDoctors && message.text.includes('specialists who can help')) {
      speechText += ` I recommend consulting with a healthcare professional for proper diagnosis and treatment.`;
    }
    
    return speechText;
  };
  
  useEffect(() => {
    if (isHealthBot && isSoundEnabled && !hasSpoken.current) {
      hasSpoken.current = true;
      const timer = setTimeout(() => {
        const speechText = prepareSpeechText();
        if (speechText) {
          speakText(speechText);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isHealthBot, message.text, message.isAnalysis, isSoundEnabled, state.selectedDisease, state.viewingPrescription, state.viewingDoctors]);
  
  return (
    <div className={`mb-4 ${isHealthBot ? '' : 'ml-auto max-w-[80%]'}`}>
      <div className={`flex ${isHealthBot ? '' : 'justify-end'}`}>
        <div className={`flex gap-3 ${isHealthBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
          <Avatar className={`h-8 w-8 ${isHealthBot ? 'bg-emerald-100' : 'bg-blue-100'}`}>
            {isHealthBot ? (
              <>
                <AvatarImage src="/assets/healthbot-avatar.png" alt="HealthBot" />
                <AvatarFallback className="bg-emerald-100 text-emerald-800">HB</AvatarFallback>
              </>
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-800">
                <UserRound className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="max-w-[calc(100%-40px)]">
            <div className={`px-4 py-2.5 rounded-xl ${
              isHealthBot 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' 
                : 'bg-blue-50 text-blue-900 border border-blue-100'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
            
            {isHealthBot && state.analysis && state.analysis.possibleDiseases.length > 0 && 
             message.text.includes("possible condition") && (
              <AnalysisMessage diseases={state.analysis.possibleDiseases} />
            )}
            
            {isHealthBot && state.selectedDisease && 
             message.text.includes(`information about ${state.selectedDisease.name}`) && (
              <DiseaseDetails disease={state.selectedDisease} />
            )}
            
            {isHealthBot && state.selectedDisease && state.viewingPrescription && 
             message.text.includes('medication details') && (
              <PrescriptionView disease={state.selectedDisease} />
            )}
            
            {isHealthBot && state.selectedDisease && state.viewingDoctors && 
             message.text.includes('specialists who can help') && (
              <DoctorsView disease={state.selectedDisease} />
            )}
          </div>
        </div>
      </div>
      
      <div className={`text-xs text-gray-400 mt-1 ${isHealthBot ? 'ml-11' : 'text-right'}`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default HealthChatMessage;
