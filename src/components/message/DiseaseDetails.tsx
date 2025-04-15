
import React from 'react';
import { Disease } from '@/types/health';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHealthBot } from '@/context/HealthBotContext';

interface DiseaseDetailsProps {
  disease: Disease;
}

const DiseaseDetails: React.FC<DiseaseDetailsProps> = ({ disease }) => {
  const { viewPrescription, viewDoctorsList } = useHealthBot();

  return (
    <div className="mt-2">
      <Card className="p-3 border-emerald-100">
        <h4 className="font-medium text-sm text-emerald-800 mb-2">{disease.name}</h4>
        <p className="text-xs text-gray-700 mb-2">{disease.description}</p>
        
        <div className="mb-2">
          <h5 className="text-xs font-medium text-emerald-700 mb-1">Common Symptoms:</h5>
          <ul className="text-xs text-gray-600 list-disc list-inside">
            {disease.commonSymptoms.map((symptom, index) => (
              <li key={index} className="mb-0.5">{symptom}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-2">
          <h5 className="text-xs font-medium text-emerald-700 mb-1">Severity:</h5>
          <p className="text-xs text-gray-600">
            {disease.severity === 'mild' && "Mild - Usually resolves without specific treatment"}
            {disease.severity === 'moderate' && "Moderate - May require medical attention"}
            {disease.severity === 'severe' && "Severe - Requires immediate medical attention"}
          </p>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            onClick={() => viewPrescription(disease)}
          >
            View Prescription
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            onClick={() => viewDoctorsList(disease)}
          >
            Find Specialists
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DiseaseDetails;
