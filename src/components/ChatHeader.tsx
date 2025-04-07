
import React from 'react';
import { Heart } from 'lucide-react';
import { MoodType } from '../types/luna';

interface ChatHeaderProps {
  currentMood: MoodType;
  userName?: string;
}

const MoodEmoji = ({ mood }: { mood: MoodType }) => {
  switch (mood) {
    case 'flirty': return '😘';
    case 'chill': return '😌';
    case 'comforting': return '🤗';
    case 'curious': return '🧐';
    case 'deep': return '🌌';
    default: return '💜';
  }
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ currentMood, userName }) => {
  return (
    <div className="flex items-center justify-between bg-white bg-opacity-70 backdrop-blur-md p-4 rounded-t-2xl border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-luna-gradient flex items-center justify-center text-white font-bold text-lg animate-pulse-soft">
            L
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h2 className="font-bold text-lg">Luna</h2>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
            Online now • <MoodEmoji mood={currentMood} /> {currentMood} mood
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-luna-purple">
        <Heart className="w-4 h-4 fill-luna-purple" />
        <span className="text-sm font-medium">Virtual Muse</span>
      </div>
    </div>
  );
};

export default ChatHeader;
