
import React, { useRef, useEffect } from 'react';
import { LunaProvider, useLuna } from '@/context/LunaContext';
import { HealthBotProvider } from '@/context/HealthBotContext';
import EmptyConversation from '@/components/EmptyConversation';
import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import HealthChatHeader from '@/components/HealthChatHeader';
import HealthChatMessage from '@/components/HealthChatMessage';
import HealthChatInput from '@/components/HealthChatInput';
import SymptomSelector from '@/components/SymptomSelector';
import HealthDataChart from '@/components/HealthDataChart';
import { Message as HealthMessage } from '@/types/health';

const LunaChat = () => {
  const { state, sendMessage, lunaStartConversation, resetConversation } = useLuna();
  const { user } = useAuth();
  const { speakText, isSoundEnabled } = useAudio();
  const welcomePlayed = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  useEffect(() => {
    if (user && isSoundEnabled && !welcomePlayed.current && state.messages.length === 0) {
      welcomePlayed.current = true;
      
      const welcomeMessage = user.user_metadata?.first_name 
        ? `Hello, I'm Luna, your personal AI companion! I'm excited to meet you, ${user.user_metadata.first_name}. How are you feeling today? I'm here to listen, chat, and support you in whatever mood you're in.`
        : `Hello! I'm Luna, your personal AI companion. I'm thrilled to meet you! How are you feeling today? I'm here to listen, chat, and support you in whatever mood you're in.`;
      
      setTimeout(() => {
        speakText(welcomeMessage);
        lunaStartConversation();
      }, 1000);
    }
  }, [user, isSoundEnabled, state.messages.length, speakText, lunaStartConversation]);

  // Convert Luna messages to HealthBot message format
  const convertToHealthMessages = (): HealthMessage[] => {
    return state.messages.map(msg => ({
      id: msg.id,
      sender: msg.sender === 'luna' ? 'healthbot' : 'user',
      text: msg.text,
      timestamp: msg.timestamp,
      isAnalysis: false
    }));
  };

  if (state.messages.length === 0) {
    return (
      <EmptyConversation 
        userName={user?.user_metadata?.first_name} 
        onStartConversation={lunaStartConversation} 
      />
    );
  }

  const healthMessages = convertToHealthMessages();

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
              {healthMessages.map((message) => (
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
    <LunaProvider>
      <HealthBotProvider>
        <div className="min-h-screen bg-gradient-radial from-luna-50 via-white to-white">
          <LunaChat />
        </div>
      </HealthBotProvider>
    </LunaProvider>
  );
};

export default Index;
