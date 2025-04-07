
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        className="rounded-xl focus-visible:ring-luna-purple resize-none min-h-[60px]"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message.trim()) {
              onSendMessage(message);
              setMessage('');
            }
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full h-[60px] w-[60px] bg-luna-purple hover:bg-luna-purple/90 shadow-md"
        disabled={!message.trim()}
      >
        <SendHorizontal size={24} />
      </Button>
    </form>
  );
};

export default ChatInput;
