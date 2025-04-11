
import React from 'react';
import { useHealthBot } from '@/context/HealthBotContext';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HealthDataChart: React.FC = () => {
  const { state, viewDoctorsList } = useHealthBot();
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
  if (state.selectedSymptoms.length > 0 && !state.selectedDisease) {
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
  
  // Show disease details and prescription options
  if (state.selectedDisease) {
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
            
            {!state.viewingDoctors && (
              <div className="space-y-4">
                <h3 className="font-medium text-emerald-700">Would you like to see the prescription details?</h3>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => viewDoctorsList(disease)}
                  >
                    Yes, show prescription
                  </Button>
                  <Button variant="outline" className="flex-1">
                    No, thanks
                  </Button>
                </div>
              </div>
            )}
            
            {state.viewingDoctors && (
              <div className="space-y-4">
                <h3 className="font-medium text-emerald-700">Would you like me to recommend a specialist?</h3>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => viewDoctorsList(disease)}
                  >
                    Yes, recommend specialist
                  </Button>
                  <Button variant="outline" className="flex-1">
                    No, thanks
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return null;
};

export default HealthDataChart;
