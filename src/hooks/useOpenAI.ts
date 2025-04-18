
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ResponseMode = 'analyze' | 'chat' | 'doctor' | 'prescription';

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

      if (error) throw error;
      
      console.log(`Received response from OpenAI for mode ${mode}`);
      return data.generatedText;
    } catch (err) {
      console.error("OpenAI error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, loading, error };
};
