
import React, { useRef, useEffect } from 'react';
import { LunaProvider, useLuna } from '@/context/LunaContext';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import MoodSelector from '@/components/MoodSelector';
import EmptyConversation from '@/components/EmptyConversation';
import SettingsDialog from '@/components/SettingsDialog';
import { Settings } from 'lucide-react';

const ChatContainer = () => {
  const { state, sendMessage, setMood, lunaStartConversation } = useLuna();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);
  
  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };
  
  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col p-4">
      <div className="mb-4 flex items-center justify-end">
        <SettingsDialog>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </SettingsDialog>
      </div>
      
      <div className="flex-1 flex flex-col bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <ChatHeader currentMood={state.currentMood} userName={state.userName} />
        
        <MoodSelector 
          currentMood={state.currentMood} 
          onSelectMood={setMood} 
        />
        
        {state.messages.length === 0 ? (
          <EmptyConversation 
            userName={state.userName} 
            onStartConversation={lunaStartConversation}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 scroll-hidden">
            <div className="flex flex-col">
              {state.messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  isLastMessage={index === state.messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
        
        <div className="p-4 bg-white bg-opacity-70 border-t border-gray-100">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <LunaProvider>
      <div className="min-h-screen bg-gradient-radial from-luna-lavender via-white to-white">
        <ChatContainer />
      </div>
    </LunaProvider>
  );
};

export default Index;
