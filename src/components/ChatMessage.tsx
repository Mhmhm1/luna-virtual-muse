
import React, { useState, useEffect } from 'react';
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
  
  // Typing effect for Luna's messages
  const [displayText, setDisplayText] = useState(isLuna ? '' : message.text);
  const [isTyping, setIsTyping] = useState(isLuna && isLastMessage);
  
  useEffect(() => {
    if (isLuna && isLastMessage) {
      // Reset for new messages
      setDisplayText('');
      setIsTyping(true);
      
      const textLength = message.text.length;
      const typingSpeed = 30; // ms per character, adjust for natural feeling
      
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= textLength) {
          setDisplayText(message.text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    } else {
      setDisplayText(message.text);
      setIsTyping(false);
    }
  }, [message.text, isLuna, isLastMessage]);
  
  return (
    <div className={cn(
      "mb-4 max-w-[80%] animate-text-fade-in",
      isLuna ? "self-start" : "self-end"
    )}>
      <div className={cn(
        "relative",
        isLuna ? "luna-message-bubble" : "user-message-bubble"
      )}>
        {displayText}
        {isTyping && <span className="typing-indicator">•••</span>}
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
