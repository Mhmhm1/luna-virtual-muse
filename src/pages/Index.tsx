
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
import { useAudio } from '@/context/AudioContext';
import { AudioProvider } from '@/context/AudioContext';
import { useTranslation } from 'react-i18next';

const HealthChatContainer = () => {
  const { t, i18n } = useTranslation();
  const { state, resetConversation } = useHealthBot();
  const { user, loading: authLoading } = useAuth();
  const { speakText, isSoundEnabled } = useAudio();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const welcomePlayed = useRef(false);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  
  // Play welcome message when component loads
  useEffect(() => {
    if (user && isSoundEnabled && !welcomePlayed.current && state.messages.length > 0) {
      welcomePlayed.current = true;
      const welcomeMessage = t("welcome_message", "Welcome to MediAssist Pro. I'm your personal health assistant. You can tell me about your symptoms, and I'll help analyze possible conditions. You can enable or disable my voice using the sound button in the header.");
      setTimeout(() => {
        speakText(welcomeMessage);
      }, 1000);
    }
  }, [user, isSoundEnabled, speakText, state.messages, t]);
  
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
            <RotateCcw className="w-3 h-3" /> {t('reset_conversation')}
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
            <h2 className="font-semibold text-lg text-emerald-800">{t('health_analysis')}</h2>
            <p className="text-sm text-emerald-700">{t('health_analysis_desc')}</p>
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
      <AudioProvider>
        <div className="min-h-screen bg-gradient-radial from-emerald-50 via-white to-white">
          <HealthChatContainer />
        </div>
      </AudioProvider>
    </HealthBotProvider>
  );
};

export default Index;
