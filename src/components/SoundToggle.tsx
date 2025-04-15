
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound, isSpeaking } = useAudio();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}
            onClick={toggleSound}
            aria-label={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {isSoundEnabled ? (
              <Volume2 className={`h-5 w-5 ${isSpeaking ? 'text-emerald-500' : 'text-emerald-700'}`} />
            ) : (
              <VolumeX className="h-5 w-5 text-emerald-700" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSoundEnabled ? 'Disable sound' : 'Enable sound'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SoundToggle;
