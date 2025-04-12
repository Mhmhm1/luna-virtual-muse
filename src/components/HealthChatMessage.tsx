
import React, { useEffect } from 'react';
import { Message, Disease } from '@/types/health';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHealthBot } from '@/context/HealthBotContext';
import { useAudio } from '@/context/AudioContext';
import { BadgeInfo, ChevronRight, UserRound, User2 } from 'lucide-react';

interface HealthChatMessageProps {
  message: Message;
}

const HealthChatMessage: React.FC<HealthChatMessageProps> = ({ message }) => {
  const { state, selectDisease, viewDoctorsList, viewPrescription } = useHealthBot();
  const { speakText } = useAudio();
  const isHealthBot = message.sender === 'healthbot';
  
  // Speak bot messages when they are displayed
  useEffect(() => {
    if (isHealthBot && !message.isAnalysis) {
      // Slight delay to ensure UI is updated first
      const timer = setTimeout(() => {
        speakText(message.text);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isHealthBot, message.text, message.isAnalysis, speakText]);
  
  return (
    <div className={`mb-4 ${isHealthBot ? '' : 'ml-auto max-w-[80%]'}`}>
      <div className={`flex ${isHealthBot ? '' : 'justify-end'}`}>
        <div className={`flex gap-3 ${isHealthBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
          <Avatar className={`h-8 w-8 ${isHealthBot ? 'bg-emerald-100' : 'bg-blue-100'}`}>
            {isHealthBot ? (
              <>
                <AvatarImage src="/assets/healthbot-avatar.png" alt="HealthBot" />
                <AvatarFallback className="bg-emerald-100 text-emerald-800">HB</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  <UserRound className="h-4 w-4" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
          
          <div className={`max-w-[calc(100%-40px)]`}>
            <div className={`px-4 py-2.5 rounded-xl ${
              isHealthBot 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' 
                : 'bg-blue-50 text-blue-900 border border-blue-100'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
            
            {/* Show disease analysis options */}
            {isHealthBot && state.analysis && state.analysis.possibleDiseases.length > 0 && 
             message.text.includes("possible condition") && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground ml-1 mb-1">Possible conditions:</p>
                
                {state.analysis.possibleDiseases.map((disease) => (
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
            )}
            
            {/* Show disease details */}
            {isHealthBot && state.selectedDisease && message.text.includes(`information about ${state.selectedDisease.name}`) && (
              <div className="mt-2">
                <Card className="p-3 border-emerald-100">
                  <h4 className="font-medium text-sm text-emerald-800 mb-2">{state.selectedDisease.name}</h4>
                  <p className="text-xs text-gray-700 mb-2">{state.selectedDisease.description}</p>
                  
                  <div className="mb-2">
                    <h5 className="text-xs font-medium text-emerald-700 mb-1">Common Symptoms:</h5>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {state.selectedDisease.commonSymptoms.map((symptom, index) => (
                        <li key={index} className="mb-0.5">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-2">
                    <h5 className="text-xs font-medium text-emerald-700 mb-1">Severity:</h5>
                    <p className="text-xs text-gray-600">
                      {state.selectedDisease.severity === 'mild' && "Mild - Usually resolves without specific treatment"}
                      {state.selectedDisease.severity === 'moderate' && "Moderate - May require medical attention"}
                      {state.selectedDisease.severity === 'severe' && "Severe - Requires immediate medical attention"}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                      onClick={() => viewPrescription(state.selectedDisease!)}
                    >
                      View Prescription
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                      onClick={() => viewDoctorsList(state.selectedDisease!)}
                    >
                      Find Specialists
                    </Button>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Prescription View */}
            {isHealthBot && state.selectedDisease && state.viewingPrescription && message.text.includes('medication details') && (
              <div className="mt-2">
                <Card className="p-3 border-emerald-100">
                  <h4 className="font-medium text-sm text-emerald-800 mb-2">Recommended Medications</h4>
                  
                  {state.selectedDisease.medications.map((medication, index) => (
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
            )}
            
            {/* Doctors View */}
            {isHealthBot && state.selectedDisease && state.viewingDoctors && message.text.includes('specialists who can help') && (
              <div className="mt-2">
                <Card className="p-3 border-emerald-100">
                  <h4 className="font-medium text-sm text-emerald-800 mb-1">
                    {state.selectedDisease.specialist.title} Specialists
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">{state.selectedDisease.specialist.description}</p>
                  
                  <div className="space-y-3">
                    {state.selectedDisease.specialist.recommendedDoctors.map((doctor) => (
                      <div key={doctor.id} className="flex gap-3 p-2 hover:bg-gray-50 rounded-md">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={doctor.photoUrl} alt={doctor.name} />
                          <AvatarFallback className="bg-emerald-100 text-emerald-800">
                            <User2 className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-emerald-800">{doctor.name}</h5>
                          <p className="text-xs text-gray-600">{doctor.specialty} · {doctor.experience}</p>
                          <p className="text-xs text-gray-500">{doctor.hospital}</p>
                          
                          <div className="flex items-center mt-1.5">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`h-3 w-3 ${i < doctor.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">{doctor.rating.toFixed(1)}</span>
                            </div>
                            
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                              doctor.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {doctor.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50 h-8 self-center"
                        >
                          Contact
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={`text-xs text-gray-400 mt-1 ${isHealthBot ? 'ml-11' : 'text-right'}`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default HealthChatMessage;
