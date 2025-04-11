
import React from 'react';
import { Message } from '../types/health';
import { cn } from '@/lib/utils';
import { Stethoscope, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHealthBot } from '@/context/HealthBotContext';

interface HealthChatMessageProps {
  message: Message;
}

const HealthChatMessage: React.FC<HealthChatMessageProps> = ({ message }) => {
  const { state, viewPrescription, viewDoctorsList } = useHealthBot();
  const isBot = message.sender === 'healthbot';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Format message text with markdown-like syntax
  const formatText = (text: string) => {
    // Replace **text** with bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace newlines with <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  };
  
  // Request for prescription action buttons
  const isPrescriptionPrompt = isBot && state.selectedDisease && 
    message.text.includes("Would you like to see the prescription details?");
  
  // Request for specialist recommendation action buttons
  const isSpecialistPrompt = isBot && state.selectedDisease && state.viewingPrescription &&
    message.text.includes("Would you like me to recommend a specialist?");

  return (
    <div className={cn(
      "mb-4 max-w-[85%]",
      isBot ? "self-start" : "self-end"
    )}>
      <div className="flex items-end gap-2">
        {isBot && (
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Stethoscope className="h-4 w-4" />
          </div>
        )}
        
        <div className={cn(
          "relative",
          isBot ? "health-bot-message" : "user-message"
        )}>
          <div 
            className={cn(
              "p-3 rounded-lg",
              isBot ? "bg-white border border-gray-200" : "bg-emerald-600 text-white"
            )}
          >
            <div dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />
            
            {isPrescriptionPrompt && (
              <div className="mt-3 flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => state.selectedDisease && viewPrescription(state.selectedDisease)}
                >
                  Yes, show prescription
                </Button>
                <Button size="sm" variant="outline">No, thanks</Button>
              </div>
            )}
            
            {isSpecialistPrompt && (
              <div className="mt-3 flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => state.selectedDisease && viewDoctorsList(state.selectedDisease)}
                >
                  Yes, recommend specialist
                </Button>
                <Button size="sm" variant="outline">No, thanks</Button>
              </div>
            )}
          </div>
        </div>
        
        {!isBot && (
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div className={cn(
        "text-xs mt-1",
        isBot ? "text-left ml-10" : "text-right mr-10",
        "text-muted-foreground"
      )}>
        {formattedTime}
      </div>
    </div>
  );
};

export default HealthChatMessage;
