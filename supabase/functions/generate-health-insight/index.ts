
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
    const { symptoms, diseases, selectedDisease, userMessage, allSymptoms } = await req.json();
    
    console.log('Generating health insight for:', { 
      symptoms: symptoms?.length || 0, 
      diseases: diseases?.length || 0, 
      selectedDisease: selectedDisease?.name || 'None',
      userMessage: userMessage ? 'User message provided' : 'No user message',
      allSymptoms: allSymptoms?.length || 0
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    let systemMessage = `You are MediAssist Pro, a helpful and intelligent medical AI assistant. You have access to a comprehensive symptom database with ${allSymptoms?.length || 0} symptoms across different categories.

Key capabilities:
1. **Symptom Analysis**: Cross-reference user symptoms with your database to provide accurate insights
2. **Typo Correction**: When users mention symptoms with spelling errors, identify and suggest the correct symptoms from your database
3. **Conversational Intelligence**: Handle personal questions, name introductions, and off-topic queries naturally
4. **Professional Guidance**: Always emphasize that your advice supplements but never replaces professional medical care

Available symptom database: ${allSymptoms ? allSymptoms.slice(0, 20).map(s => `${s.name} (${s.category})`).join(', ') + (allSymptoms.length > 20 ? ` and ${allSymptoms.length - 20} more...` : '') : 'Not available'}

Guidelines:
- Be empathetic and professional
- When users ask for your name, respond as "MediAssist Pro"
- If users mention unrelated topics, gently redirect to health concerns
- Look for symptom keywords and suggest matching symptoms from the database
- Always emphasize consulting healthcare professionals`;
    
    // Handle conversational elements and typos
    if (userMessage) {
      prompt = `User message: "${userMessage}"

Current user symptoms: ${symptoms?.map(s => s.name).join(', ') || 'None selected'}

Instructions:
1. If the user asks for your name or introduces themselves, respond warmly as "MediAssist Pro"
2. If they mention symptoms with typos, identify correct symptoms from the database and acknowledge corrections
3. If they mention unrelated topics, gently redirect to health concerns while being friendly
4. Look for symptom keywords and suggest matching symptoms from the database
5. Be conversational but always professional

Provide a helpful response that handles their input appropriately.`;
    } else if (selectedDisease) {
      // Enhanced disease-specific analysis
      const relatedSymptoms = allSymptoms ? allSymptoms.filter(s => 
        selectedDisease.commonSymptoms.some(commonSymptom => 
          s.name.toLowerCase().includes(commonSymptom.toLowerCase()) ||
          commonSymptom.toLowerCase().includes(s.name.toLowerCase())
        )
      ) : [];

      prompt = `Provide comprehensive insights about ${selectedDisease.name}.

Patient's reported symptoms: ${symptoms?.map(s => `${s.name} (${s.category})`).join(', ') || 'None'}

Disease information:
- Name: ${selectedDisease.name}
- Description: ${selectedDisease.description}
- Severity: ${selectedDisease.severity}
- Common symptoms: ${selectedDisease.commonSymptoms?.join(', ') || 'Not specified'}

Related symptoms from database: ${relatedSymptoms.slice(0, 10).map(s => `${s.name} (${s.category})`).join(', ')}

Provide:
1. How the patient's symptoms align with ${selectedDisease.name}
2. Additional symptoms to watch for based on the database
3. Symptom patterns and disease progression explanation
4. Lifestyle recommendations for this condition
5. When to seek immediate medical attention
6. Reminders about professional medical care

Be thorough, empathetic, and always emphasize consulting healthcare professionals.`;
    } else if (diseases && diseases.length > 0) {
      // Enhanced general analysis with symptom database
      const symptomCategories = symptoms ? [...new Set(symptoms.map(s => s.category))] : [];
      const relatedSymptoms = allSymptoms ? allSymptoms.filter(s => 
        symptomCategories.includes(s.category) && 
        !symptoms?.some(userSymptom => userSymptom.id === s.id)
      ) : [];

      prompt = `Analyze these symptoms using your comprehensive symptom database.

Patient's symptoms: ${symptoms?.map(s => `${s.name} (${s.category})`).join(', ') || 'None'}
Affected body systems: ${symptomCategories.join(', ')}

Possible conditions: ${diseases.map(d => `${d.name} (${d.matchPercentage || 'Unknown'}% match, ${d.severity} severity)`).join(', ')}

Additional symptoms to consider: ${relatedSymptoms.slice(0, 8).map(s => `${s.name} (${s.category})`).join(', ')}

Provide:
1. Analysis of symptom patterns and their significance
2. Questions about additional symptoms from the database
3. How possible conditions relate to affected body systems
4. General wellness recommendations
5. Red flag symptoms requiring immediate attention
6. Guidance on symptom monitoring

Keep it helpful and comprehensive while emphasizing professional medical consultation.`;
    } else if (symptoms && symptoms.length > 0) {
      // Enhanced symptom analysis
      const symptomCategories = symptoms ? [...new Set(symptoms.map(s => s.category))] : [];
      
      prompt = `Provide comprehensive analysis for these symptoms.

Patient's symptoms: ${symptoms.map(s => `${s.name} (${s.category})`).join(', ')}
Affected body systems: ${symptomCategories.join(', ')}

Provide:
1. Information about these symptoms and affected body systems
2. Common patterns and potential connections between symptoms
3. Questions to help narrow down diagnosis
4. General wellness recommendations for affected systems
5. When to seek different levels of medical attention
6. How to monitor and document symptoms

Be thorough, empathetic, and always emphasize professional medical consultation.`;
    } else {
      prompt = `The user hasn't selected any symptoms yet. Provide a warm welcome message explaining how you can help them analyze their health symptoms using your comprehensive medical database. Mention that you can:

1. Help identify symptoms they might be experiencing
2. Correct any spelling mistakes in symptom names
3. Answer questions about their health concerns
4. Provide personalized health insights

Keep it friendly and encourage them to describe their symptoms.`;
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
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content;

    if (!insight) {
      throw new Error('No insight generated from OpenAI');
    }

    console.log('Generated health insight successfully');

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-health-insight function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate health insight',
      details: 'Please check the console logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
