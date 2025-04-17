
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useTranslation } from 'react-i18next';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

const SoundToggle: React.FC = () => {
  const { t } = useTranslation();
  const { 
    isSoundEnabled, 
    toggleSound, 
    isSpeaking, 
    stopSpeaking, 
    availableVoices,
    preferredVoice,
    setVoice 
  } = useTextToSpeech();
  
  const [showSettings, setShowSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [speechPitch, setSpeechPitch] = useState<number>(1);

  // Filter voices to include only English ones for better quality
  const englishVoices = availableVoices.filter(voice => 
    voice.lang.startsWith('en-') || voice.lang === 'en'
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse bg-emerald-50' : ''}`}
              onClick={toggleSound}
              aria-label={isSoundEnabled ? t('disable_voice') : t('enable_voice')}
            >
              {isSoundEnabled ? (
                <Volume2 className={`h-5 w-5 transition-colors ${isSpeaking ? 'text-emerald-500' : 'text-emerald-700'}`} />
              ) : (
                <VolumeX className="h-5 w-5 text-emerald-700" />
              )}
            </Button>
            
            {isSoundEnabled && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full h-7 w-7"
                  >
                    <Settings className="h-3.5 w-3.5 text-emerald-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{t('voice_settings')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => stopSpeaking()}>
                      {t('stop_speaking')}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{t('select_voice')}</DropdownMenuLabel>
                  <div className="max-h-[200px] overflow-y-auto px-2">
                    {englishVoices.map(voice => (
                      <DropdownMenuItem 
                        key={voice.name}
                        className={`${voice.name === preferredVoice ? 'bg-emerald-50 font-medium' : ''}`}
                        onClick={() => setVoice(voice.name)}
                      >
                        {voice.name} {voice.default ? "(Default)" : ""}
                      </DropdownMenuItem>
                    ))}
                    
                    {englishVoices.length === 0 && (
                      <div className="text-sm text-muted-foreground p-2">
                        {t('no_english_voices')}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSoundEnabled ? t('disable_voice') : t('enable_voice')}</p>
          {isSpeaking && isSoundEnabled && <p className="text-xs text-emerald-500">{t('speaking')}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SoundToggle;
