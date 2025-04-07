
import React from 'react';
import { Message } from '../types/luna';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage }) => {
  const isLuna = message.sender === 'luna';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div className={cn(
      "mb-4 max-w-[80%] animate-text-fade-in",
      isLuna ? "self-start" : "self-end"
    )}>
      <div className={cn(
        "relative",
        isLuna ? "luna-message-bubble" : "user-message-bubble"
      )}>
        {message.text}
      </div>
      <div className={cn(
        "text-xs mt-1",
        isLuna ? "text-left ml-2" : "text-right mr-2",
        "text-muted-foreground"
      )}>
        {formattedTime}
      </div>
    </div>
  );
};

export default ChatMessage;
