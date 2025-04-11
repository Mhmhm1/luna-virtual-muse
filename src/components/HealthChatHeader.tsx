
import React from 'react';
import { Stethoscope } from 'lucide-react';

const HealthChatHeader: React.FC = () => {
  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
        <Stethoscope className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-semibold text-lg text-emerald-800">MediAssist Pro</h2>
        <p className="text-sm text-emerald-700">Your intelligent health companion</p>
      </div>
    </div>
  );
};

export default HealthChatHeader;
