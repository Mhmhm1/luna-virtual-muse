
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
            className={`rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse bg-emerald-50' : ''}`}
            onClick={toggleSound}
            aria-label={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {isSoundEnabled ? (
              <Volume2 className={`h-5 w-5 transition-colors ${isSpeaking ? 'text-emerald-500' : 'text-emerald-700'}`} />
            ) : (
              <VolumeX className="h-5 w-5 text-emerald-700" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSoundEnabled ? 'Disable voice' : 'Enable voice'}</p>
          {isSpeaking && isSoundEnabled && <p className="text-xs text-emerald-500">Speaking...</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SoundToggle;
