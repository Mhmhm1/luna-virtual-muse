
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { XIcon, Brain, Stethoscope, HeartPulse, Bone, Footprints, Heart, Ear, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHealthBot } from '@/context/HealthBotContext';
import { Symptom, BodyCategory } from '@/types/health';
import { getAllCategories, getCategoryLabel, getSymptomsByCategory } from '@/data/symptoms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SymptomSearch from './SymptomSearch';

const SymptomSelector: React.FC = () => {
  const { state, selectSymptom, removeSymptom, clearSymptoms, startAnalysis, sendMessage } = useHealthBot();
  const [activeCategory, setActiveCategory] = useState<BodyCategory | 'all'>('all');

  // Define icons for each category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'neurological':
        return <Brain className="h-4 w-4" />;
      case 'respiratory':
        return <Stethoscope className="h-4 w-4" />;
      case 'digestive':
        return <HeartPulse className="h-4 w-4" />;
      case 'musculoskeletal':
        return <Bone className="h-4 w-4" />;
      case 'dermatological':
        return <Footprints className="h-4 w-4" />;
      case 'cardiovascular':
        return <Heart className="h-4 w-4" />;
      case 'ent':
        return <Ear className="h-4 w-4" />;
      case 'urinary':
        return <Droplets className="h-4 w-4" />;
      case 'general':
      default:
        return <HeartPulse className="h-4 w-4" />;
    }
  };

  const handleSymptomSelection = (symptom: Symptom) => {
    if (!state.selectedSymptoms.some(s => s.id === symptom.id)) {
      selectSymptom(symptom);
      // Create a message that looks like it came from the user
      const symptomMessage = `I'm experiencing ${symptom.name}.`;
      sendMessage(symptomMessage);
    }
  };
  
  const handleAnalyzeClick = () => {
    // Create a message that looks like the user requested analysis
    sendMessage("Can you analyze these symptoms for me?");
    setTimeout(() => startAnalysis(), 800);
  };

  // Get symptoms for the selected category or all if "all" is selected
  const getFilteredSymptoms = (): Symptom[] => {
    if (activeCategory === 'all') {
      return [];
    }
    return getSymptomsByCategory(activeCategory);
  };
  
  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-emerald-800">Selected Symptoms</h3>
          {state.selectedSymptoms.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-red-500"
              onClick={clearSymptoms}
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
          {state.selectedSymptoms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No symptoms selected. Search or select from categories below.</p>
          ) : (
            state.selectedSymptoms.map(symptom => (
              <Badge key={symptom.id} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 py-1 px-2">
                {symptom.name}
                <button 
                  className="ml-1" 
                  onClick={() => removeSymptom(symptom.id)}
                  title="Remove symptom"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        
        {state.selectedSymptoms.length > 0 && (
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-10" 
            onClick={handleAnalyzeClick}
          >
            Send
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-emerald-800">Search Symptoms</h3>
        <SymptomSearch 
          onSelectSymptom={handleSymptomSelection} 
          placeholder="Type to search symptoms..."
        />
        
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <label className="text-sm font-medium text-emerald-800">Filter by category:</label>
          </div>
          <Select 
            value={activeCategory} 
            onValueChange={(value) => setActiveCategory(value as BodyCategory | 'all')}
          >
            <SelectTrigger className="h-9 bg-emerald-50 border-emerald-200 focus:ring-emerald-500">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {getAllCategories().map(category => (
                <SelectItem key={category} value={category} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span>{getCategoryLabel(category)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {activeCategory !== 'all' && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {getFilteredSymptoms().map(symptom => (
              <SymptomButton 
                key={symptom.id}
                symptom={symptom}
                isSelected={state.selectedSymptoms.some(s => s.id === symptom.id)}
                onSelect={handleSymptomSelection}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface SymptomButtonProps {
  symptom: Symptom;
  isSelected: boolean;
  onSelect: (symptom: Symptom) => void;
}

const SymptomButton: React.FC<SymptomButtonProps> = ({ symptom, isSelected, onSelect }) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={isSelected 
        ? "bg-emerald-600 hover:bg-emerald-700 justify-start" 
        : "hover:bg-emerald-50 hover:text-emerald-900 border-emerald-200 justify-start"
      }
      size="sm"
      onClick={() => !isSelected && onSelect(symptom)}
      disabled={isSelected}
      title={symptom.description}
    >
      {symptom.name}
    </Button>
  );
};

export default SymptomSelector;
