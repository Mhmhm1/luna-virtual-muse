
import React from 'react';
import { Disease } from '@/types/health';
import { Card } from '@/components/ui/card';
import { ChevronRight, BadgeInfo } from 'lucide-react';
import { useHealthBot } from '@/context/HealthBotContext';

interface AnalysisMessageProps {
  diseases: Disease[];
}

const AnalysisMessage: React.FC<AnalysisMessageProps> = ({ diseases }) => {
  const { selectDisease } = useHealthBot();

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs text-muted-foreground ml-1 mb-1">Possible conditions:</p>
      
      {diseases.map((disease) => (
        <Card 
          key={disease.id} 
          className="p-3 hover:bg-gray-50 cursor-pointer border-emerald-100"
          onClick={() => selectDisease(disease)}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <h4 className="font-medium text-sm text-emerald-800">{disease.name}</h4>
                {disease.matchPercentage && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {disease.matchPercentage}% match
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{disease.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Card>
      ))}
      
      <div className="text-xs text-gray-500 flex items-center mt-1 ml-1">
        <BadgeInfo className="h-3 w-3 mr-1" />
        <span>This is not a medical diagnosis. Consult a healthcare professional.</span>
      </div>
    </div>
  );
};

export default AnalysisMessage;
