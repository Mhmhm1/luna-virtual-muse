
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { symptoms, categories } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical AI assistant providing insights based on symptoms."
        },
        {
          role: "user",
          content: `Provide a brief, compassionate health insight based on these symptoms: ${symptoms.join(', ')}. 
                    The symptoms are categorized into these body systems: ${categories.join(', ')}. 
                    Give a general, non-diagnostic overview that offers support and suggests potential next steps.`
        }
      ],
      max_tokens: 150
    });

    const insight = response.choices[0].message.content || "No insight available.";

    return new Response(
      JSON.stringify({ insight }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
