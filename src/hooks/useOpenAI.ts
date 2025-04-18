
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type ResponseMode = 'analyze' | 'chat' | 'doctor' | 'prescription';

// Fallback responses when OpenAI API is unavailable
const fallbackResponses: Record<ResponseMode, string> = {
  analyze: `Based on your symptoms, I can provide some general information:

Condition: Possible Condition A (85% match)
Description: A common condition related to your symptoms.
Common Symptoms: Symptom 1, Symptom 2, Symptom 3
Severity: moderate
Treatment: Rest and consult a doctor
Specialist: General Practitioner

Condition: Possible Condition B (75% match)
Description: Another condition that might explain your symptoms.
Common Symptoms: Symptom 2, Symptom 4, Symptom 5
Severity: mild
Treatment: Over-the-counter medication may help
Specialist: Family Doctor

Please note that this is a fallback response as our AI service is temporarily unavailable. For accurate medical advice, please consult a healthcare professional.`,

  chat: `I understand your concern about these symptoms. While I'd typically provide a more personalized response, our AI service is temporarily unavailable. 

Generally, it's important to monitor your symptoms and consult with a healthcare professional if they persist or worsen. Stay hydrated, get adequate rest, and avoid activities that might aggravate your condition.

Please try again later for a more tailored response to your specific situation.`,

  doctor: `SPECIALIST 1:
- Name: Dr. Jane Smith, MD
- Specialty: General Medicine
- Hospital: Central Medical Center
- Experience: 15 years
- Bio: Board-certified physician specializing in comprehensive care
- Rating: 4.8
- Available: Yes
- Phone: (555) 123-4567
- License: MD12345
- Photo: "/assets/doctor-placeholder.png"

SPECIALIST 2:
- Name: Dr. Michael Johnson, MD
- Specialty: Family Medicine
- Hospital: Community Hospital
- Experience: 20 years
- Bio: Experienced doctor focused on preventive care
- Rating: 4.6
- Available: Yes
- Phone: (555) 987-6543
- License: MD67890
- Photo: "/assets/doctor-placeholder.png"

Note: This is a fallback response as our AI service is temporarily unavailable.`,

  prescription: `MEDICATION 1:
- Name: Generic Medication A
- Dosage: As prescribed by your doctor
- Frequency: As directed
- Duration: As recommended by healthcare provider
- Side Effects:
  * Side effect 1
  * Side effect 2
  * Side effect 3

MEDICATION 2:
- Name: Generic Medication B
- Dosage: As prescribed by your doctor
- Frequency: As directed
- Duration: As recommended by healthcare provider
- Side Effects:
  * Side effect 1
  * Side effect 2
  * Side effect 3

IMPORTANT DISCLAIMER: This is a fallback response as our AI service is temporarily unavailable. This is NOT a prescription. Always consult with a qualified healthcare professional before taking any medication.`
};

export const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (
    prompt: string, 
    model: string = 'gpt-4o',
    mode: ResponseMode = 'chat'
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Sending request to OpenAI with mode: ${mode}`);
      
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: JSON.stringify({ prompt, model, mode })
      });

      if (error) {
        console.error("Supabase function error:", error);
        
        if (error.message?.includes("quota") || error.message?.includes("429")) {
          // Handle quota exceeded error with fallback
          toast({
            title: "AI Service Temporarily Unavailable",
            description: "Using fallback responses. Some features may be limited.",
            variant: "warning",
          });
          return fallbackResponses[mode];
        }
        
        throw error;
      }
      
      console.log(`Received response from OpenAI for mode ${mode}`);
      return data.generatedText;
    } catch (err) {
      console.error("OpenAI error:", err);
      
      // Check if the error is related to API quota
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      
      if (
        errorMessage.toLowerCase().includes('quota') || 
        errorMessage.toLowerCase().includes('rate limit') ||
        errorMessage.toLowerCase().includes('429')
      ) {
        toast({
          title: "AI Service Temporarily Unavailable",
          description: "Using fallback responses. Some features may be limited.",
          variant: "warning",
        });
        return fallbackResponses[mode];
      }
      
      setError(errorMessage);
      // Still return fallback in any error case to prevent UI from breaking
      return fallbackResponses[mode];
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, loading, error };
};
