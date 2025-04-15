
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useHealthBot } from '@/context/HealthBotContext';
import { searchSymptoms } from '@/data/symptoms';
import { toast } from '@/hooks/use-toast';

const VoiceInput: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const { sendMessage, selectSymptom } = useHealthBot();

  const processVoiceCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();

    // Check for specific commands
    if (lowerText.includes('analyze') || lowerText.includes('check symptoms')) {
      sendMessage('Can you analyze these symptoms for me?');
      return;
    }

    // Search for symptoms in the spoken text
    const foundSymptoms = searchSymptoms(lowerText);
    if (foundSymptoms.length > 0) {
      foundSymptoms.forEach(symptom => {
        selectSymptom(symptom);
        sendMessage(`I'm experiencing ${symptom.name}.`);
      });
      toast({
        description: `Found ${foundSymptoms.length} symptom(s) in your voice input.`,
      });
    } else {
      sendMessage(text);
    }
  }, [sendMessage, selectSymptom]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        description: "Voice recognition is not supported in your browser. Please use Chrome.",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        description: "Listening...",
      });
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      processVoiceCommand(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        variant: "destructive",
        description: "Error recognizing voice. Please try again.",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [processVoiceCommand]);

  return (
    <Button
      onClick={startListening}
      variant="ghost"
      size="icon"
      className={`rounded-full transition-colors ${isListening ? 'bg-red-50 text-red-500' : ''}`}
      title="Voice input"
    >
      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
};

export default VoiceInput;
