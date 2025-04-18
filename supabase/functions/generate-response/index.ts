
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
      Your purpose is to analyze patient symptoms and provide HIGHLY STRUCTURED information about possible conditions that can be easily parsed.
      
      When analyzing symptoms:
      1. Structure your response with CLEARLY LABELED sections for each condition
      2. For EACH possible condition, ALWAYS provide these exact sections:
         - Condition: [Name] (XX% match)
         - Description: [clear description]
         - Common Symptoms: [list symptoms as bullet points]
         - Severity: [mild/moderate/severe]
         - Treatment: [basic approach]
         - Specialist: [type needed]
      3. ALWAYS assign a percentage match confidence for each condition (numbers between 60-95%)
      4. ALWAYS present 2-4 possible conditions that best match the symptoms
      5. Include appropriate medical disclaimers
      
      CRITICAL: Use consistent formatting with clear headers and maintain the exact structure described above for EACH condition. The application will parse your response to extract these labeled sections.`;
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
      systemPrompt = `You are MediAssist Pro providing STRUCTURED information about specialists.
      Your response MUST be precisely formatted for parsing:
      
      For EACH specialist (provide exactly 3-4), use this EXACT format:
      
      SPECIALIST 1:
      - Name: [Full name with credentials]
      - Specialty: [Specific field]
      - Hospital: [Affiliation]
      - Experience: [Years, between 15-30]
      - Bio: [Short background]
      - Rating: [Number between 3.5-5.0]
      - Available: [Yes/No]
      - Phone: [Fictional phone number]
      - License: [Fictional license number]
      - Photo: [leave as "/assets/doctor-placeholder.png"]
      
      SPECIALIST 2:
      [repeat same structure]
      
      CRITICAL: Follow this EXACT format with the exact labels shown above for EACH specialist. The application will parse your response for these specific fields.`;
    } else if (mode === 'prescription') {
      systemPrompt = `You are MediAssist Pro providing STRUCTURED medication information.
      Your response MUST follow this EXACT format for parsing:
      
      For EACH medication (provide 2-3 options), use this structure:
      
      MEDICATION 1:
      - Name: [Generic and brand name]
      - Dosage: [Typical dosing amount]
      - Frequency: [How often to take]
      - Duration: [How long to take]
      - Side Effects:
        * [effect 1]
        * [effect 2]
        * [effect 3]
      
      MEDICATION 2:
      [repeat same structure]
      
      CRITICAL: Follow this EXACT format with the exact labels shown above for EACH medication. The application will parse your response for these specific sections.
      
      Always include a clear disclaimer that this is educational information only and not a prescription.`;
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
      temperature: 0.3, // Lowered for more consistent formatting
      max_tokens: 1200,
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
