
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';
import { useHealthBot } from '@/context/HealthBotContext';

const HealthChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, state } = useHealthBot();
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !state.loading) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        className="rounded-xl resize-none min-h-[60px] focus-visible:ring-emerald-500"
        placeholder={state.loading ? "Please wait..." : "Describe your symptoms..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={state.loading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message.trim() && !state.loading) {
              sendMessage(message);
              setMessage('');
            }
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full h-[60px] w-[60px] bg-emerald-600 hover:bg-emerald-700 shadow-md"
        disabled={!message.trim() || state.loading}
      >
        <SendHorizontal size={24} />
      </Button>
    </form>
  );
};

export default HealthChatInput;
