
import React from 'react';
import { Stethoscope } from 'lucide-react';

const HealthChatHeader: React.FC = () => {
  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
        <Stethoscope className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-semibold text-lg">Health Assistant</h2>
        <p className="text-sm text-muted-foreground">Your virtual medical consultant</p>
      </div>
    </div>
  );
};

export default HealthChatHeader;
