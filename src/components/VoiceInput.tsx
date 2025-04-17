
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume, VolumeX } from 'lucide-react';
import { useHealthBot } from '@/context/HealthBotContext';
import { searchSymptoms } from '@/data/symptoms';
import { toast } from '@/hooks/use-toast';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

const VoiceInput: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const { sendMessage, selectSymptom, startAnalysis, clearSymptoms, resetConversation } = useHealthBot();
  const { isSoundEnabled, toggleSound, speakText } = useTextToSpeech();
  const [isHelpActive, setIsHelpActive] = useState(false);

  const voiceCommands = [
    { command: 'analyze symptoms', description: 'Start symptom analysis' },
    { command: 'clear symptoms', description: 'Clear all selected symptoms' },
    { command: 'reset conversation', description: 'Start a new conversation' },
    { command: 'toggle sound', description: 'Turn voice feedback on/off' },
    { command: 'help', description: 'List available voice commands' }
  ];

  const showHelpToast = useCallback(() => {
    setIsHelpActive(true);
    const helpText = `Available voice commands:\n${voiceCommands.map(cmd => 
      `• "${cmd.command}" - ${cmd.description}`
    ).join('\n')}`;
    
    toast({
      title: "Voice Command Help",
      description: helpText,
      duration: 10000,
    });
    
    if (isSoundEnabled) {
      speakText("Here are the available voice commands: " + 
        voiceCommands.map(cmd => `${cmd.command}, which ${cmd.description}`).join('. '));
    }
    
    setTimeout(() => setIsHelpActive(false), 10000);
  }, [isSoundEnabled, speakText, voiceCommands]);

  // Show help on first render
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('voice-help-seen');
    if (!hasSeenHelp) {
      setTimeout(() => {
        showHelpToast();
        localStorage.setItem('voice-help-seen', 'true');
      }, 3000);
    }
  }, [showHelpToast]);

  const processVoiceCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Play a sound to confirm the command was received
    if (isSoundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRn4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVoAAAAMAB4ANgBIAFQAYgBlAF8AVQBIADYAIgALAO7/0/+8/6b/mP+Q/47/lP+g/7H/xP/Z//H/CQAiADsAVABsAIIAlwCpALcAwQDJAM4A0ADQAMsAxQC9ALIApgCYAIkAegBrAFwATgA/ADEAIwAVAAkA/v/0/+z/5P/d/9j/0//P/83/y//K/8v/zf/Q/9T/2f/f/+X/7P/0//z/BQANABYAHwAnAC8ANwA/AEYATgBVAFsAYQBnAGwAcQB1AHkAfAB/AIIAhACGAIcAiACIAIgAiACIAIcAhgCEAIIAgAB9AHsAdwB0AHAAawBnAGIAXABWAFAASgBEAD4AOAAyACsAJQAeABgAEgALAAQA/v/3//H/6//l/9//2f/U/87/yf/E/7//u/+3/7P/r/+r/6j/pf+i/6D/nv+c/5v/mv+Z/5j/mP+Y/5j/mf+a/5v/nP+e/6D/ov+k/6f/qv+s/6//sv+1/7n/vP/A/8P/x//L/8//0//X/9z/4P/l/+r/7v/z//j//f8CAQcBCwEQARUBGgEfASMBKAEsATEBNQE5AT0BQQFFAUkBTAFQAVMBVgFZAVwBXwFhAWQBZgFoAWoBbAFuAW8BcQFyAXMBdAF1AXYBdgF3AXcBdwF3AXcBdwF2AXYBdQF0AXQBcwFyAXEBcAFvAW0BbAFqAWkBZwFmAWQBYgFgAV4BXAFaAVcBVQFTAVABTgFLAUkBRgFEAUEBPwE8AToBNwE0ATEBLwEsASoBJwEkASEBHwEcARkBFwEUARIBDwEMARQBCQESAQgBEwEHARIBBgERAAMAEwEIABIAAwAQAP7/DgD6/wwA9v8NAPP/DgDv/xAA7P8RAOj/EgDl/xMA4f8VAOD/NP/c/xYA2f8XANb/GADM/xUAqf8nAJH/OwCC/z0Aef89AHH/PQBu/z0AbP89AGv/PABq/zwAav88AGr/PQBq/z0Aav8+AGv/PgBs/z8Abf9AAG//QQBw/0IAdP9CAHX/TAB7/2EAgP9hAIX/YQCK/2EAjv9hAJL/YQCW/2EAmv9hAJ3/YQCg/2EAo/9hAKX/YQCo/2EAqv9hAKz/YQCt/2EArv9hAK//YQCw/2EAsf9gALL/YACz/18AtP9eALT/XQC1/1wAtf9bALb/WgC2/1kAtv9YALf/VwC3/1YAt/9UALj/UwC4/1IAuP9RALn/UAC5/08Auf9OALr/TQC6/0wAuv9LALv/SgC7/0kAu/9IALz/RwC8/0YAvP9FAQ==');
      audio.play();
    }

    // Log the recognized text to help users understand what was heard
    console.log('Voice recognized:', text);
    
    // Help command - show available commands
    if (lowerText.includes('help') || lowerText.includes('commands') || lowerText.includes('what can you do')) {
      showHelpToast();
      return;
    }
    
    // Analyze command
    if (lowerText.includes('analyze') || 
        lowerText.includes('check symptoms') || 
        lowerText.includes('start analysis') ||
        lowerText.includes('analyze symptoms')) {
      sendMessage('Can you analyze these symptoms for me?');
      setTimeout(() => startAnalysis(), 500);
      return;
    }
    
    // Clear symptoms command
    if (lowerText.includes('clear symptoms') || 
        lowerText.includes('remove symptoms') || 
        lowerText.includes('delete symptoms')) {
      clearSymptoms();
      return;
    }
    
    // Reset conversation command
    if (lowerText.includes('reset') || 
        lowerText.includes('start over') ||
        lowerText.includes('new conversation')) {
      resetConversation();
      return;
    }
    
    // Toggle sound command
    if (lowerText.includes('toggle sound') || 
        lowerText.includes('turn sound') ||
        lowerText.includes('enable voice') ||
        lowerText.includes('disable voice')) {
      toggleSound();
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
      
      if (isSoundEnabled) {
        speakText(`I've added ${foundSymptoms.length} symptoms to your list: ${foundSymptoms.map(s => s.name).join(', ')}`);
      }
    } else {
      // If no known commands or symptoms, just send as a message
      sendMessage(text);
    }
  }, [sendMessage, selectSymptom, startAnalysis, clearSymptoms, resetConversation, toggleSound, isSoundEnabled, speakText, showHelpToast]);

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
      className={`rounded-full transition-colors ${isListening ? 'bg-red-50 text-red-500' : ''} ${isHelpActive ? 'animate-pulse' : ''}`}
      title="Voice input"
    >
      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
};

export default VoiceInput;
