import React, { useState } from 'react';
import { useHealthBot } from '@/context/HealthBotContext';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { symptoms } from '@/data/symptoms';
import { useToast } from '@/hooks/use-toast';

const HealthDataChart: React.FC = () => {
  const { state, viewDoctorsList, selectDisease } = useHealthBot();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const generateAIInsight = async (customMessage?: string) => {
    setLoadingInsight(true);
    setError(null);
    
    try {
      console.log('Generating AI insight with data:', {
        symptoms: state.selectedSymptoms?.length || 0,
        diseases: state.analysis?.possibleDiseases?.length || 0,
        selectedDisease: state.selectedDisease?.name || 'None',
        userMessage: customMessage || userMessage || 'None',
        allSymptoms: symptoms?.length || 0
      });

      const { data, error } = await supabase.functions.invoke('generate-health-insight', {
        body: {
          symptoms: state.selectedSymptoms || [],
          diseases: state.analysis?.possibleDiseases || [],
          selectedDisease: state.selectedDisease || null,
          userMessage: customMessage || userMessage || null,
          allSymptoms: symptoms || []
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate AI insight');
      }

      if (data?.insight) {
        setAiInsight(data.insight);
        toast({
          title: "AI Insight Generated",
          description: "MediAssist Pro has analyzed your health data.",
        });
      } else {
        throw new Error('No insight received from AI');
      }

      if (customMessage || userMessage) {
        setUserMessage('');
        setShowMessageInput(false);
      }
    } catch (error) {
      console.error('Error generating AI insight:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to generate AI insight: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoadingInsight(false);
    }
  };
  
  const handleMessageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userMessage.trim()) {
      generateAIInsight();
    }
  };
  
  // Welcome state when no symptoms are selected yet
  if (state.selectedSymptoms.length === 0) {
    return (
      <Card className="transition-all duration-500 ease-in-out">
        <CardHeader>
          <CardTitle className="text-emerald-800">Welcome to MediAssist Pro</CardTitle>
          <CardDescription>Your AI-powered health assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2038/2038738.png" 
              alt="Health Assistant" 
              className="w-32 h-32 mx-auto mb-4 opacity-60 transition-opacity duration-300"
            />
            <p className="text-muted-foreground mb-2">
              Please select your symptoms from the left panel, or chat with me directly.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              I can help analyze symptoms, handle typos, and provide AI-powered health recommendations.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setShowMessageInput(!showMessageInput)}
                variant="outline"
                className="w-full"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with MediAssist Pro
              </Button>
              
              {showMessageInput && (
                <div className="space-y-2">
                  <Input
                    placeholder="Hi! I'm MediAssist Pro. Tell me your name or describe your symptoms..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={handleMessageSubmit}
                    className="text-sm"
                  />
                  <Button 
                    onClick={() => generateAIInsight()}
                    disabled={loadingInsight || !userMessage.trim()}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 w-full"
                  >
                    {loadingInsight ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </div>
              )}
              
              <Button 
                onClick={() => generateAIInsight('Hello, what is your name?')}
                disabled={loadingInsight}
                variant="ghost"
                size="sm"
                className="w-full text-emerald-600"
              >
                {loadingInsight ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Brain className="mr-2 h-3 w-3" />
                )}
                Get AI Welcome Message
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Error generating AI insight:</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {aiInsight && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200 animate-in slide-in-from-bottom-4">
              <h4 className="font-medium text-emerald-800 mb-2 flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                MediAssist Pro
              </h4>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {aiInsight}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Show symptom distribution when symptoms are selected but no analysis yet
  if (state.selectedSymptoms.length > 0 && !state.analysis) {
    // Group symptoms by category
    const categoryCount: Record<string, number> = {};
    state.selectedSymptoms.forEach(symptom => {
      if (categoryCount[symptom.category]) {
        categoryCount[symptom.category]++;
      } else {
        categoryCount[symptom.category] = 1;
      }
    });
    
    const data = Object.entries(categoryCount).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count
    }));
    
    return (
      <div className="space-y-4">
        <Card className="transition-all duration-500 ease-in-out">
          <CardHeader>
            <CardTitle className="text-emerald-800">Symptom Categories</CardTitle>
            <CardDescription>Distribution of your selected symptoms</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ChartContainer>
            
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <Button 
                  onClick={() => generateAIInsight()}
                  disabled={loadingInsight}
                  className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 flex-1"
                >
                  {loadingInsight ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Insights...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Get AI Health Insights
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => setShowMessageInput(!showMessageInput)}
                  variant="outline"
                  disabled={loadingInsight}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
              
              {showMessageInput && (
                <div className="space-y-2">
                  <Input
                    placeholder="Ask specific questions about your symptoms or tell me about additional concerns..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={handleMessageSubmit}
                    className="text-sm"
                  />
                  <Button 
                    onClick={() => generateAIInsight()}
                    disabled={loadingInsight || !userMessage.trim()}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 w-full"
                  >
                    {loadingInsight ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Ask MediAssist Pro'
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {aiInsight && (
          <Card className="transition-all duration-500 ease-in-out transform animate-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                MediAssist Pro Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {aiInsight}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  // Show analysis results
  if (state.analysis) {
    const possibleDiseases = state.analysis.possibleDiseases;
    
    // Display disease list if no disease is selected yet
    if (!state.selectedDisease) {
      return (
        <div className="space-y-4">
          <Card className="transition-all duration-500 ease-in-out">
            <CardHeader>
              <CardTitle className="text-emerald-800">Health Analysis</CardTitle>
              <CardDescription>Possible conditions based on your symptoms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {possibleDiseases.map((disease) => (
                  <div 
                    key={disease.id} 
                    className="p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => selectDisease(disease)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-emerald-800">{disease.name}</h5>
                      <div className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">
                        {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{disease.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${disease.matchPercentage || 50}%` }}
                          ></div>
                        </div>
                        <span>{disease.matchPercentage || 50}% match</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => generateAIInsight()}
                    disabled={loadingInsight}
                    className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 flex-1"
                  >
                    {loadingInsight ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Insights...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Get AI Insights on Analysis
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => setShowMessageInput(!showMessageInput)}
                    variant="outline"
                    disabled={loadingInsight}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                {showMessageInput && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Ask about these conditions or describe other symptoms..."
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyPress={handleMessageSubmit}
                      className="text-sm"
                    />
                    <Button 
                      onClick={() => generateAIInsight()}
                      disabled={loadingInsight || !userMessage.trim()}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 w-full"
                    >
                      {loadingInsight ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Ask MediAssist Pro'
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-2">
                <p className="font-medium text-emerald-700">IMPORTANT:</p>
                <p>This analysis is not a medical diagnosis. Please consult with a healthcare professional.</p>
              </div>
            </CardContent>
          </Card>

          {aiInsight && (
            <Card className="transition-all duration-500 ease-in-out transform animate-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  MediAssist Pro Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {aiInsight}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
    
    // Show disease details 
    if (state.selectedDisease && !state.viewingPrescription && !state.viewingDoctors) {
      const disease = state.selectedDisease;
      
      return (
        <div className="space-y-4">
          <Card className="transition-all duration-500 ease-in-out">
            <CardHeader>
              <CardTitle className="text-emerald-800">{disease.name}</CardTitle>
              <CardDescription>
                <span className="font-medium">Severity:</span> {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{disease.description}</p>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => generateAIInsight()}
                    disabled={loadingInsight}
                    className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 flex-1"
                  >
                    {loadingInsight ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Insights...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Get AI Insights for {disease.name}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => setShowMessageInput(!showMessageInput)}
                    variant="outline"
                    disabled={loadingInsight}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                {showMessageInput && (
                  <div className="space-y-2">
                    <Input
                      placeholder={`Ask specific questions about ${disease.name}...`}
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyPress={handleMessageSubmit}
                      className="text-sm"
                    />
                    <Button 
                      onClick={() => generateAIInsight()}
                      disabled={loadingInsight || !userMessage.trim()}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 w-full"
                    >
                      {loadingInsight ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Ask About This Condition'
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Select "Yes" in the chat to view prescription details</p>
              </div>
            </CardContent>
          </Card>

          {aiInsight && (
            <Card className="transition-all duration-500 ease-in-out transform animate-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Insights for {disease.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {aiInsight}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
    
    // Show prescription details
    if (state.selectedDisease && state.viewingPrescription && !state.viewingDoctors) {
      const disease = state.selectedDisease;
      
      return (
        <div className="space-y-4">
          <Card className="transition-all duration-500 ease-in-out">
            <CardHeader>
              <CardTitle className="text-emerald-800">Prescription for {disease.name}</CardTitle>
              <CardDescription>Recommended medications and dosages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disease.medications.map((med, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm transition-all duration-200 hover:shadow-md">
                    <h3 className="font-medium text-emerald-800">{med.name}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="font-medium">Dosage:</span> {med.dosage}</p>
                      <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                      <p><span className="font-medium">Duration:</span> {med.duration}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-amber-700">Possible Side Effects:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {med.sideEffects.map((effect, i) => (
                          <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Select "Yes" in the chat to view specialist recommendations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Show specialists recommendations
    if (state.selectedDisease && state.viewingDoctors) {
      const disease = state.selectedDisease;
      
      return (
        <div className="space-y-4">
          <Card className="transition-all duration-500 ease-in-out">
            <CardHeader>
              <CardTitle className="text-emerald-800">Recommended Specialists</CardTitle>
              <CardDescription>{disease.specialist.title} specialists for {disease.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{disease.specialist.description}</p>
              
              <div className="space-y-4">
                {disease.specialist.recommendedDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-4 bg-white rounded-lg border border-emerald-100 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                        <img src={doctor.photoUrl} alt={doctor.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium text-emerald-800">{doctor.name}</h3>
                        <p className="text-sm text-emerald-600">{doctor.specialty}</p>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < doctor.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                          <span className="text-xs ml-1">{doctor.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-gray-600">{doctor.bio}</p>
                      <p className="mt-2"><span className="font-medium">Hospital:</span> {doctor.hospital}</p>
                      <p><span className="font-medium">Experience:</span> {doctor.experience}</p>
                      <p><span className="font-medium">Contact:</span> {doctor.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }
  
  return null;
};

export default HealthDataChart;
