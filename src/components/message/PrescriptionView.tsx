
import React from 'react';
import { Disease } from '@/types/health';
import { Card } from '@/components/ui/card';
import { BadgeInfo } from 'lucide-react';

interface PrescriptionViewProps {
  disease: Disease;
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ disease }) => {
  return (
    <div className="mt-2">
      <Card className="p-3 border-emerald-100">
        <h4 className="font-medium text-sm text-emerald-800 mb-2">Recommended Medications</h4>
        
        {disease.medications.map((medication, index) => (
          <div key={index} className="mb-3 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <h5 className="text-xs font-medium text-emerald-700">{medication.name}</h5>
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Dosage:</span> {medication.dosage}
            </p>
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Frequency:</span> {medication.frequency}
            </p>
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Duration:</span> {medication.duration}
            </p>
            
            {medication.sideEffects.length > 0 && (
              <div className="mt-1">
                <p className="text-xs font-medium text-gray-600">Possible side effects:</p>
                <ul className="text-xs text-gray-500 list-disc list-inside">
                  {medication.sideEffects.map((effect, idx) => (
                    <li key={idx} className="text-xs">{effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        
        <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-md mt-2 flex">
          <BadgeInfo className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
          <div>
            This information is for educational purposes only. Always consult a healthcare professional before taking any medication.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrescriptionView;
