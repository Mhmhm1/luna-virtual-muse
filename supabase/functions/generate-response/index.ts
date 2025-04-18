
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
    const { prompt, model = 'gpt-4o', mode = 'analyze' } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    
    // Define different system prompts based on the mode
    let systemPrompt = '';
    
    if (mode === 'analyze') {
      systemPrompt = `You are MediAssist Pro, a specialized medical analysis AI. 
      Your purpose is to analyze patient symptoms and provide detailed, structured information about possible conditions.
      
      When analyzing symptoms:
      1. Always structure your response with clear sections for each possible condition
      2. For each condition, provide:
         - A clear name with medical terminology
         - A layperson-friendly description
         - Common symptoms associated with this condition
         - Severity level (mild, moderate, severe)
         - Basic treatment approaches
         - Type of specialist recommended
      3. Assign a percentage match confidence for each condition
      4. Always present 2-4 possible conditions that best match the symptoms
      5. Include appropriate medical disclaimers
      
      Your analysis should be precise, evidence-based, and presented in a way that helps patients understand their potential conditions without causing undue anxiety.
      Remember: You are NOT providing a diagnosis, only educational information about possible conditions.`;
    } else if (mode === 'chat') {
      systemPrompt = `You are MediAssist Pro, a specialized medical assistant AI.
      Your purpose is to help patients understand their health concerns in a clear, empathetic manner.
      
      When responding to patient inquiries:
      1. Be concise but thorough
      2. Use medical terminology but always explain it in layperson terms
      3. If you identify potential symptoms, gently suggest the user add them to their symptom list
      4. Don't attempt to diagnose, but provide educational information
      5. If the user describes a potentially serious condition, encourage them to seek medical attention
      
      Remember: Your role is to educate and assist, not to diagnose or treat. Always include appropriate medical disclaimers.`;
    } else if (mode === 'doctor') {
      systemPrompt = `You are MediAssist Pro acting as a physician information system.
      Your purpose is to generate information about specialists who could help with specific medical conditions.
      
      For each specialist recommendation, include:
      1. Full name with credentials (M.D., D.O., etc.)
      2. Specialty and sub-specialty
      3. A brief professional background
      4. Hospital or clinic affiliation
      5. Years of experience (15-30 years range)
      6. A brief explanation of why this specialist is appropriate for the condition
      
      Generate 3-4 distinct specialist profiles for the given condition. Make the information realistic but entirely fictional.`;
    } else if (mode === 'prescription') {
      systemPrompt = `You are MediAssist Pro acting as a medication information system.
      Your purpose is to provide educational information about medications commonly used for specific conditions.
      
      For each medication, include:
      1. Generic and brand name
      2. Drug class and mechanism
      3. Typical dosing regimen
      4. Common side effects (list 3-5)
      5. Important precautions
      
      List 2-3 medication options typically used for the condition in question.
      Format this information in a structured, easy-to-read manner.
      
      Include a clear disclaimer that this is educational information only and not a prescription.`;
    }

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: 'system', 
          content: systemPrompt
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const generatedText = response.choices[0].message.content;

    return new Response(
      JSON.stringify({ generatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
