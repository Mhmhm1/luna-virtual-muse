
import React, { useRef, useEffect } from 'react';
import { HealthBotProvider, useHealthBot } from '@/context/HealthBotContext';
import HealthChatHeader from '@/components/HealthChatHeader';
import HealthChatMessage from '@/components/HealthChatMessage';
import HealthChatInput from '@/components/HealthChatInput';
import SymptomSelector from '@/components/SymptomSelector';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const HealthChatContainer = () => {
  const { state, resetConversation } = useHealthBot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);
  
  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col p-4">
      <div className="mb-4 flex items-center justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm text-muted-foreground flex items-center gap-1"
          onClick={resetConversation}
        >
          <RotateCcw className="w-3 h-3" /> Reset Conversation
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <HealthChatHeader />
        
        <div className="flex-1 overflow-y-auto p-4 scroll-hidden bg-gray-50">
          <div className="flex flex-col">
            {state.messages.map((message) => (
              <HealthChatMessage 
                key={message.id} 
                message={message} 
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <SymptomSelector />
        
        <div className="p-4 bg-white bg-opacity-70 border-t border-gray-100">
          <HealthChatInput />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <HealthBotProvider>
      <div className="min-h-screen bg-gradient-radial from-emerald-50 via-white to-white">
        <HealthChatContainer />
      </div>
    </HealthBotProvider>
  );
};

export default Index;
