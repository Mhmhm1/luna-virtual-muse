
import React from 'react';
import { Message } from '../types/health';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Pill, Stethoscope, User } from 'lucide-react';

interface HealthChatMessageProps {
  message: Message;
}

const HealthChatMessage: React.FC<HealthChatMessageProps> = ({ message }) => {
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
          {message.isAnalysis ? (
            <Card className="border-emerald-200 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-emerald-700">
                  <Pill className="h-4 w-4" />
                  <h4 className="font-medium">Medical Analysis</h4>
                </div>
                <div 
                  className="text-sm prose-sm max-w-none" 
                  dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                />
              </CardContent>
            </Card>
          ) : (
            <div 
              className={cn(
                "p-3 rounded-lg",
                isBot ? "bg-white border border-gray-200" : "bg-emerald-600 text-white"
              )}
              dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
            />
          )}
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
