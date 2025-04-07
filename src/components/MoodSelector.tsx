
import React from 'react';
import { MoodType } from '../types/luna';
import { Heart, CloudSun, Sparkles, Search, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  currentMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

interface MoodOption {
  value: MoodType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const moodOptions: MoodOption[] = [
  {
    value: 'flirty',
    label: 'Flirty',
    icon: <Heart className="w-4 h-4" />,
    color: 'bg-pink-100 text-pink-700 active:bg-pink-200 active:ring-pink-500',
  },
  {
    value: 'chill',
    label: 'Chill',
    icon: <CloudSun className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700 active:bg-blue-200 active:ring-blue-500',
  },
  {
    value: 'comforting',
    label: 'Comforting',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-amber-100 text-amber-700 active:bg-amber-200 active:ring-amber-500',
  },
  {
    value: 'curious',
    label: 'Curious',
    icon: <Search className="w-4 h-4" />,
    color: 'bg-green-100 text-green-700 active:bg-green-200 active:ring-green-500',
  },
  {
    value: 'deep',
    label: 'Deep',
    icon: <Moon className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-700 active:bg-indigo-200 active:ring-indigo-500',
  },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onSelectMood }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {moodOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelectMood(option.value)}
          className={cn(
            'mood-pill flex items-center gap-1',
            option.color,
            currentMood === option.value && 'active'
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
