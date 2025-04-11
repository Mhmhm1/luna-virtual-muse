import React, { useState } from 'react';
import { Message, Disease, Doctor } from '../types/health';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Pill, Stethoscope, User, ChevronRight, Star, Phone, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHealthBot } from '@/context/HealthBotContext';

interface HealthChatMessageProps {
  message: Message;
}

const HealthChatMessage: React.FC<HealthChatMessageProps> = ({ message }) => {
  const { state, selectDisease, viewDoctorsList } = useHealthBot();
  const isBot = message.sender === 'healthbot';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Format message text with markdown-like syntax
  const formatText = (text: string) => {
    // Replace **text** with bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace newlines with <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  };

  // Welcome message - special styling
  if (message.id === "welcome-message") {
    return (
      <div className="mb-6 max-w-[90%] self-start">
        <div className="flex items-start gap-2">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
            <Stethoscope className="h-5 w-5" />
          </div>
          
          <Card className="border-emerald-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3 text-emerald-700 border-b border-emerald-100 pb-2">
                <h4 className="font-semibold">Welcome to MediAssist Pro</h4>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">Hello! How are you feeling today?</p>
                <p className="text-gray-700">I'm here to help analyze your symptoms and provide health insights. Please select any symptoms you're experiencing from the panel below.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-xs mt-1 text-left ml-10 text-muted-foreground">
          {formattedTime}
        </div>
      </div>
    );
  }
  
  // Display selected disease details
  if (state.selectedDisease && message.id === "disease-details") {
    const disease = state.selectedDisease;
    
    return (
      <div className="mb-6 max-w-[90%] self-start">
        <div className="flex items-start gap-2">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
            <Stethoscope className="h-5 w-5" />
          </div>
          
          <Card className="border-emerald-200 shadow-md w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3 text-emerald-700 border-b border-emerald-100 pb-2">
                <Pill className="h-4 w-4" />
                <h4 className="font-semibold">{disease.name}</h4>
                <Badge variant={
                  disease.severity === 'mild' ? 'outline' : 
                  disease.severity === 'moderate' ? 'secondary' : 'destructive'
                }>
                  {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)}
                </Badge>
              </div>
              
              <p className="text-sm mb-4">{disease.description}</p>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Recommended Medications:</h5>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disease.medications.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.dosage}, {med.frequency}</TableCell>
                        <TableCell>{med.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Possible Side Effects:</h5>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {disease.medications.flatMap(med => med.sideEffects).map((effect, index) => (
                    <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Specialist Recommendation:</h5>
                <p className="text-sm">
                  <span className="font-medium">{disease.specialist.title}</span> ({disease.specialist.field})
                  <br />
                  {disease.specialist.description}
                </p>
              </div>
              
              <div className="mt-4">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => viewDoctorsList(disease)}
                >
                  View Recommended Specialists
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-xs mt-1 text-left ml-10 text-muted-foreground">
          {formattedTime}
        </div>
      </div>
    );
  }
  
  // Display doctors list
  if (state.viewingDoctors && message.id === "doctors-list") {
    const disease = state.selectedDisease;
    
    if (!disease) return null;
    
    return (
      <div className="mb-6 max-w-[90%] self-start">
        <div className="flex items-start gap-2">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
            <Stethoscope className="h-5 w-5" />
          </div>
          
          <Card className="border-emerald-200 shadow-md w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3 text-emerald-700 border-b border-emerald-100 pb-2">
                <User className="h-4 w-4" />
                <h4 className="font-semibold">Recommended {disease.specialist.title} Specialists</h4>
              </div>
              
              <div className="space-y-4">
                {disease.specialist.recommendedDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img src={doctor.photoUrl} alt={doctor.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1">
                        <h5 className="font-medium text-emerald-800 flex items-center gap-1">
                          {doctor.name}
                          {doctor.available && (
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                          )}
                        </h5>
                        
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        
                        <div className="flex items-center gap-2 text-xs text-amber-600 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-3 w-3" 
                              fill={i < doctor.rating ? "currentColor" : "none"} 
                            />
                          ))}
                          <span>{doctor.rating.toFixed(1)}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{doctor.experience}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{doctor.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-600 pl-[76px]">
                      <p>{doctor.bio}</p>
                      <p className="mt-1 text-gray-500">License: {doctor.licenseNumber}</p>
                      <p className="text-gray-500">{doctor.hospital}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-xs mt-1 text-left ml-10 text-muted-foreground">
          {formattedTime}
        </div>
      </div>
    );
  }
  
  // Standard message display
  return (
    <div className={cn(
      "mb-4 max-w-[85%]",
      isBot ? "self-start" : "self-end"
    )}>
      <div className="flex items-end gap-2">
        {isBot && (
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Stethoscope className="h-4 w-4" />
          </div>
        )}
        
        <div className={cn(
          "relative",
          isBot ? "health-bot-message" : "user-message"
        )}>
          <div 
            className={cn(
              "p-3 rounded-lg",
              isBot ? "bg-white border border-gray-200" : "bg-emerald-600 text-white"
            )}
            dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
          />
        </div>
        
        {!isBot && (
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div className={cn(
        "text-xs mt-1",
        isBot ? "text-left ml-10" : "text-right mr-10",
        "text-muted-foreground"
      )}>
        {formattedTime}
      </div>
    </div>
  );
};

export default HealthChatMessage;
