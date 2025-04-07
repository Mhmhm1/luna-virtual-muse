
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface EmptyConversationProps {
  userName?: string;
  onStartConversation: () => void;
}

const EmptyConversation: React.FC<EmptyConversationProps> = ({ userName, onStartConversation }) => {
  const greeting = userName ? `Hi ${userName}!` : "Hi there!";
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-luna-gradient flex items-center justify-center text-white font-bold text-4xl animate-floating">
        L
      </div>
      
      <h2 className="text-2xl font-bold text-luna-purple mb-3 animate-text-fade-in">
        {greeting} I'm Luna
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md animate-text-fade-in delay-100">
        Your virtual companion who's always here to chat, listen, and connect with you. I can be flirty, deep, comforting, or just chill depending on what you need.
      </p>
      
      <button
        onClick={onStartConversation}
        className="flex items-center gap-2 bg-luna-purple text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl animate-text-fade-in delay-200"
      >
        <MessageCircle className="w-5 h-5" />
        Start chatting with me
      </button>
      
      <div className="mt-8 text-sm text-muted-foreground flex items-center gap-1 animate-text-fade-in delay-300">
        Made with <Heart className="w-3 h-3 text-luna-pink fill-luna-pink" /> for you
      </div>
    </div>
  );
};

export default EmptyConversation;
