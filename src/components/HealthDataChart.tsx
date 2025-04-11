
import React from 'react';
import { useHealthBot } from '@/context/HealthBotContext';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HealthDataChart: React.FC = () => {
  const { state, viewDoctorsList, selectDisease } = useHealthBot();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Welcome state when no symptoms are selected yet
  if (state.selectedSymptoms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Welcome to MediAssist Pro</CardTitle>
          <CardDescription>How are you feeling today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2038/2038738.png" 
              alt="Health Assistant" 
              className="w-32 h-32 mx-auto mb-4 opacity-60"
            />
            <p className="text-muted-foreground mb-2">
              Please select your symptoms from the left panel.
            </p>
            <p className="text-xs text-muted-foreground">
              I'll help analyze your symptoms and provide recommendations.
            </p>
          </div>
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
        <Card>
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
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Health Analysis</CardTitle>
              <CardDescription>Possible conditions based on your symptoms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {possibleDiseases.map((disease) => (
                  <div 
                    key={disease.id} 
                    className="p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
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
                            className="bg-emerald-600 h-1.5 rounded-full" 
                            style={{ width: `${disease.matchPercentage || 50}%` }}
                          ></div>
                        </div>
                        <span>{disease.matchPercentage || 50}% match</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-2">
                <p className="font-medium text-emerald-700">IMPORTANT:</p>
                <p>This analysis is not a medical diagnosis. Please consult with a healthcare professional.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Show disease details 
    if (state.selectedDisease && !state.viewingPrescription && !state.viewingDoctors) {
      const disease = state.selectedDisease;
      
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">{disease.name}</CardTitle>
              <CardDescription>
                <span className="font-medium">Severity:</span> {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{disease.description}</p>
              
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Select "Yes" in the chat to view prescription details</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Show prescription details
    if (state.selectedDisease && state.viewingPrescription && !state.viewingDoctors) {
      const disease = state.selectedDisease;
      
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Prescription for {disease.name}</CardTitle>
              <CardDescription>Recommended medications and dosages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disease.medications.map((med, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Recommended Specialists</CardTitle>
              <CardDescription>{disease.specialist.title} specialists for {disease.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{disease.specialist.description}</p>
              
              <div className="space-y-4">
                {disease.specialist.recommendedDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-4 bg-white rounded-lg border border-emerald-100 shadow-sm">
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
