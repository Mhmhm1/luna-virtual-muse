
import React from 'react';
import { useHealthBot } from '@/context/HealthBotContext';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HealthDataChart: React.FC = () => {
  const { state } = useHealthBot();
  
  // Group symptoms by category
  const symptomsByCategory = state.selectedSymptoms.reduce<Record<string, number>>(
    (acc, symptom) => {
      acc[symptom.category] = (acc[symptom.category] || 0) + 1;
      return acc;
    }, 
    {}
  );
  
  // Format data for the pie chart
  const chartData = Object.entries(symptomsByCategory).map(([category, count]) => ({
    name: formatCategoryName(category),
    value: count,
    category
  }));
  
  // Colors for different categories
  const COLORS = {
    neurological: '#10b981', // emerald-500
    respiratory: '#14b8a6', // teal-500
    digestive: '#06b6d4', // cyan-500
    musculoskeletal: '#0ea5e9', // sky-500
    dermatological: '#8b5cf6', // violet-500
    general: '#6366f1', // indigo-500
  };
  
  // Helper function to format category name
  function formatCategoryName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  const chartConfig = {
    neurological: { color: COLORS.neurological },
    respiratory: { color: COLORS.respiratory },
    digestive: { color: COLORS.digestive },
    musculoskeletal: { color: COLORS.musculoskeletal },
    dermatological: { color: COLORS.dermatological },
    general: { color: COLORS.general },
  };
  
  const NoSymptomsSelected = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
      <h3 className="text-lg font-medium text-emerald-800 mb-2">No symptoms selected yet</h3>
      <p className="text-sm text-gray-500">
        Select symptoms from the left panel to visualize your health data
      </p>
    </div>
  );
  
  const noSelectedDisease = !state.selectedDisease && state.messages.every(m => m.id !== "disease-details");
  const showAnalysisPrompt = state.selectedSymptoms.length > 0 && !state.messages.some(m => m.isAnalysis);
  
  return (
    <div className="space-y-4">
      {/* Symptoms Distribution Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-emerald-800">Symptom Categories</CardTitle>
          <CardDescription>Distribution of your reported symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          {state.selectedSymptoms.length === 0 ? (
            <NoSymptomsSelected />
          ) : (
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.category as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Prompt or Information */}
      {showAnalysisPrompt && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <p className="text-emerald-800">
              Click "Analyze My Symptoms" to receive a health assessment based on your selected symptoms.
            </p>
          </CardContent>
        </Card>
      )}
      
      {noSelectedDisease && state.messages.some(m => m.isAnalysis) && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <p className="text-emerald-800">
              Click on a condition from the analysis to view more details.
            </p>
          </CardContent>
        </Card>
      )}
      
      {state.selectedDisease && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-emerald-800">Selected Condition</CardTitle>
            <CardDescription>You're currently viewing {state.selectedDisease.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">Severity: {state.selectedDisease.severity}</p>
              <p className="font-medium mt-2">Recommended specialist:</p>
              <p>{state.selectedDisease.specialist.title} ({state.selectedDisease.specialist.field})</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthDataChart;

