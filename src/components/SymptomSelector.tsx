
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHealthBot } from '@/context/HealthBotContext';
import { Symptom } from '@/types/health';
import { getAllCategories, getCategoryLabel, getSymptomsByCategory } from '@/data/symptoms';

const SymptomSelector: React.FC = () => {
  const { state, selectSymptom, removeSymptom, clearSymptoms, startAnalysis } = useHealthBot();
  const [activeCategory, setActiveCategory] = useState(getAllCategories()[0]);
  
  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Selected Symptoms</h3>
          {state.selectedSymptoms.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={clearSymptoms}
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {state.selectedSymptoms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No symptoms selected. Select from the categories below.</p>
          ) : (
            state.selectedSymptoms.map(symptom => (
              <Badge key={symptom.id} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                {symptom.name}
                <button 
                  className="ml-1" 
                  onClick={() => removeSymptom(symptom.id)}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        
        {state.selectedSymptoms.length > 0 && (
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700" 
            onClick={startAnalysis}
          >
            Analyze Symptoms
          </Button>
        )}
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Add Symptoms</h3>
        <Tabs defaultValue={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
          <TabsList className="w-full h-auto flex flex-wrap justify-start mb-2">
            {getAllCategories().map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="text-xs py-1 px-2"
              >
                {getCategoryLabel(category)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {getAllCategories().map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-2 gap-2">
                {getSymptomsByCategory(category).map(symptom => (
                  <SymptomButton 
                    key={symptom.id}
                    symptom={symptom}
                    isSelected={state.selectedSymptoms.some(s => s.id === symptom.id)}
                    onSelect={selectSymptom}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
      className={isSelected ? "bg-emerald-600 hover:bg-emerald-700" : "hover:bg-emerald-50 hover:text-emerald-900 border-emerald-200"}
      size="sm"
      onClick={() => !isSelected && onSelect(symptom)}
      disabled={isSelected}
    >
      {symptom.name}
    </Button>
  );
};

export default SymptomSelector;
