
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Stethoscope, LogOut, LogIn, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHealthBot } from '@/context/HealthBotContext';
import ConversationHistory from './ConversationHistory';
import SoundToggle from './SoundToggle';

const HealthChatHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const { saveConversation } = useHealthBot();
  const navigate = useNavigate();

  const handleSaveConversation = async () => {
    await saveConversation();
  };

  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-emerald-100">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-emerald-800">MediAssist Pro</h2>
          <p className="text-xs text-emerald-600">Your personal health assistant</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <SoundToggle />
        
        {user ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              title="Save Conversation"
              onClick={handleSaveConversation}
            >
              <Save className="h-5 w-5 text-emerald-700" />
            </Button>
            
            <ConversationHistory />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              title="Sign Out"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 text-emerald-700" />
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
            onClick={() => navigate('/auth')}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default HealthChatHeader;
