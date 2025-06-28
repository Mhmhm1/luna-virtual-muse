
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
    
    console.log('Generating enhanced health insight for:', { 
      symptoms: symptoms?.length, 
      diseases: diseases?.length, 
      selectedDisease: selectedDisease?.name,
      userMessage: userMessage ? 'User message provided' : 'No user message',
      allSymptoms: allSymptoms?.length
    });

    let prompt = '';
    
    // Handle conversational elements and typos
    if (userMessage) {
      const conversationalPrompt = `You are MediAssist Pro, a helpful medical AI assistant. 

Available symptoms database: ${allSymptoms ? allSymptoms.map(s => `${s.name} (${s.category})`).join(', ') : 'Not provided'}

User message: "${userMessage}"

Instructions:
1. If the user asks for your name or introduces themselves, respond warmly as "MediAssist Pro" and ask about their symptoms
2. If they mention symptoms with typos or variations, identify the correct symptoms from the database and acknowledge the correction
3. If they mention unrelated topics, gently redirect to health concerns while being friendly
4. Look for symptom keywords in their message and suggest matching symptoms from the database
5. Be empathetic and professional, always emphasizing the need for professional medical care

Current user symptoms: ${symptoms?.map(s => s.name).join(', ') || 'None selected'}

Provide a helpful response that handles their input appropriately.`;

      prompt = conversationalPrompt;
    } else if (selectedDisease) {
      // Enhanced disease-specific analysis using symptom database
      const relatedSymptoms = allSymptoms ? allSymptoms.filter(s => 
        selectedDisease.commonSymptoms.some(commonSymptom => 
          s.name.toLowerCase().includes(commonSymptom.toLowerCase()) ||
          commonSymptom.toLowerCase().includes(s.name.toLowerCase())
        )
      ) : [];

      prompt = `As MediAssist Pro, provide comprehensive insights about ${selectedDisease.name}.

Patient's reported symptoms: ${symptoms.map(s => `${s.name} (${s.category} category)`).join(', ')}

Disease information:
- Name: ${selectedDisease.name}
- Description: ${selectedDisease.description}
- Severity: ${selectedDisease.severity}
- Common symptoms: ${selectedDisease.commonSymptoms.join(', ')}

Related symptoms from database: ${relatedSymptoms.map(s => `${s.name} (${s.category})`).join(', ')}

Please provide:
1. How the patient's symptoms align with ${selectedDisease.name}
2. Any additional symptoms they should watch for based on the database
3. Explanation of symptom patterns and disease progression
4. Lifestyle recommendations specific to this condition
5. When to seek immediate medical attention
6. Important reminders about professional medical care

Be thorough but concise, empathetic, and always emphasize consulting healthcare professionals.`;
    } else if (diseases && diseases.length > 0) {
      // Enhanced general analysis with symptom database cross-referencing
      const symptomCategories = symptoms ? [...new Set(symptoms.map(s => s.category))] : [];
      const relatedSymptoms = allSymptoms ? allSymptoms.filter(s => 
        symptomCategories.includes(s.category) && 
        !symptoms.some(userSymptom => userSymptom.id === s.id)
      ) : [];

      prompt = `As MediAssist Pro, analyze these symptoms using the comprehensive symptom database.

Patient's symptoms: ${symptoms.map(s => `${s.name} (${s.category} category)`).join(', ')}
Symptom categories affected: ${symptomCategories.join(', ')}

Possible conditions identified: ${diseases.map(d => `${d.name} (${d.matchPercentage}% match, ${d.severity} severity)`).join(', ')}

Additional symptoms to consider from database: ${relatedSymptoms.slice(0, 10).map(s => `${s.name} (${s.category})`).join(', ')}

Please provide:
1. Analysis of symptom patterns and what they might indicate
2. Questions about additional symptoms they should consider from the database
3. How the possible conditions relate to their symptom categories
4. General wellness recommendations based on affected body systems
5. Red flag symptoms that require immediate attention
6. Guidance on symptom monitoring and documentation

Keep the response helpful, comprehensive, and always emphasize consulting healthcare professionals.`;
    } else {
      // Enhanced general symptom analysis
      const symptomCategories = symptoms ? [...new Set(symptoms.map(s => s.category))] : [];
      
      prompt = `As MediAssist Pro, provide comprehensive analysis for these symptoms.

Patient's symptoms: ${symptoms.map(s => `${s.name} (${s.category} category)`).join(', ')}
Body systems affected: ${symptomCategories.join(', ')}

Please provide:
1. General information about these symptoms and affected body systems
2. Common patterns and potential interconnections between symptoms
3. Questions to help narrow down the diagnosis
4. General wellness recommendations for the affected body systems
5. When to seek different levels of medical attention (urgent vs routine)
6. How to monitor and document symptoms effectively

Be thorough, empathetic, and always emphasize professional medical consultation.`;
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
            content: `You are MediAssist Pro, an intelligent medical AI assistant with access to a comprehensive symptom database. You excel at:

1. Symptom Analysis: Cross-referencing user symptoms with the database to provide accurate insights
2. Typo Correction: Identifying misspelled symptoms and suggesting correct ones from the database
3. Conversational Intelligence: Handling personal questions, names, and redirecting to health topics naturally
4. Database Integration: Using the symptom database to suggest related symptoms and narrow down diagnoses
5. Professional Guidance: Always emphasizing that your advice supplements but never replaces professional medical care

Be empathetic, intelligent, and thorough. When users make typos in symptom names, gently correct them. When they ask personal questions or mention their name, respond warmly as MediAssist Pro. Always use the symptom database to provide comprehensive analysis.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const insight = data.choices[0].message.content;

    console.log('Generated enhanced health insight successfully');

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
