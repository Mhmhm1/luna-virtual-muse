import React, { useRef, useEffect } from 'react';
import { HealthBotProvider, useHealthBot } from '@/context/HealthBotContext';
import HealthChatHeader from '@/components/HealthChatHeader';
import HealthChatMessage from '@/components/HealthChatMessage';
import HealthChatInput from '@/components/HealthChatInput';
import SymptomSelector from '@/components/SymptomSelector';
import HealthDataChart from '@/components/HealthDataChart';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const HealthChatContainer = () => {
  const { state, resetConversation } = useHealthBot();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-4 h-screen p-4">
      <div className="flex-1 flex flex-col">
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
      
      <div className="md:w-1/2 flex flex-col">
        <div className="flex-1 bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <h2 className="font-semibold text-lg text-emerald-800">Health Analysis</h2>
            <p className="text-sm text-emerald-700">Charts and recommendations based on your symptoms</p>
          </div>
          
          <div className="p-4 overflow-y-auto h-full">
            <HealthDataChart />
          </div>
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
