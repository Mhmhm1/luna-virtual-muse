
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, diseases, selectedDisease } = await req.json();
    
    console.log('Generating health insight for:', { symptoms: symptoms?.length, diseases: diseases?.length, selectedDisease: selectedDisease?.name });

    let prompt = '';
    
    if (selectedDisease) {
      prompt = `As a medical AI assistant, provide helpful insights about ${selectedDisease.name}. 
      The patient has these symptoms: ${symptoms.map(s => s.name).join(', ')}.
      
      Please provide:
      1. A brief explanation of how these symptoms relate to ${selectedDisease.name}
      2. General lifestyle recommendations
      3. When to seek immediate medical attention
      4. Important reminders about professional medical care
      
      Keep the response concise, empathetic, and always emphasize consulting healthcare professionals.`;
    } else if (diseases && diseases.length > 0) {
      prompt = `As a medical AI assistant, analyze these possible conditions based on symptoms: ${symptoms.map(s => s.name).join(', ')}.
      
      Possible conditions: ${diseases.map(d => d.name).join(', ')}.
      
      Please provide:
      1. General insights about these symptoms
      2. Common patterns you notice
      3. General wellness recommendations
      4. Important reminders about seeking professional care
      
      Keep the response helpful, concise, and always emphasize consulting healthcare professionals.`;
    } else {
      prompt = `As a medical AI assistant, provide general health insights for someone experiencing these symptoms: ${symptoms.map(s => s.name).join(', ')}.
      
      Please provide:
      1. General information about these symptoms
      2. Common causes or patterns
      3. General wellness recommendations
      4. When to seek medical attention
      
      Keep the response helpful and always emphasize consulting healthcare professionals.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful medical AI assistant. Always remind users that your advice is not a substitute for professional medical diagnosis and treatment. Be empathetic, informative, and encourage seeking professional medical care when appropriate.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const insight = data.choices[0].message.content;

    console.log('Generated health insight successfully');

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-health-insight function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
