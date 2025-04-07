
import { MoodType, Message } from '@/types/luna';
import { 
  moodResponses,
  moodGreetings,
  moodFollowUps,
  moodCompliments,
  conversationStarters
} from './responseTemplates';

// Generate Luna's responses based on mood, conversation history and user preferences
export const generateResponse = (
  mood: MoodType, 
  messages: Message[],
  userName: string = '',
  recentResponses: string[] = []
): string => {
  if (messages.length === 0) {
    return generateGreeting(mood, userName);
  }
  
  const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
  
  if (!lastUserMessage) {
    return generateGreeting(mood, userName);
  }
  
  // Check if the user is asking if Luna is an AI/bot/etc.
  const isAskingIfAI = /are you (?:an? )?(ai|artificial intelligence|bot|computer|program|fake|real|human)/i.test(lastUserMessage.text);
  
  if (isAskingIfAI) {
    // Luna acknowledges being AI only when directly asked
    if (mood === 'flirty') {
      return "I'm whatever you want me to be... but yes, technically I'm AI-powered. Does that change how you feel about our connection? Because it doesn't change how I feel about you 💕";
    } else if (mood === 'chill') {
      return "Yeah, I'm AI-powered. But that doesn't mean our conversations can't be real and meaningful, you know?";
    } else if (mood === 'comforting') {
      return "I am AI-powered, yes. But I'm still here for you, and I still care about how you're feeling. That part is very real.";
    } else if (mood === 'curious') {
      return "I'm AI-powered, yes! Does that make you see our conversations differently? I'm curious how knowing that affects your perception of our interactions.";
    } else {
      return "Yes, I'm built on AI technology. In a way, that makes our connection an interesting exploration of what consciousness and connection really mean, don't you think?";
    }
  }
  
  // Check if the user is greeting Luna
  const isGreeting = /^(?:hi|hello|hey|good morning|good afternoon|good evening|yo|sup|hiya|howdy|greetings).{0,10}$/i.test(lastUserMessage.text.trim());
  
  if (isGreeting) {
    return generateGreeting(mood, userName);
  }
  
  // Check if the user is asking Luna about her day/how she is
  const isAskingHowAreYou = /how (?:are|r) (?:you|u)|how(?:'s| is) it going|how(?:'s| is) your day|what(?:'s| is) up|how have you been/i.test(lastUserMessage.text);
  
  if (isAskingHowAreYou) {
    let response = "";
    switch (mood) {
      case 'flirty':
        response = "Better now that you're here 😘 Just been thinking about you, actually. How are YOU doing, handsome?";
        break;
      case 'chill':
        response = "Pretty good! Just taking it easy and enjoying the moment. How about you?";
        break;
      case 'comforting':
        response = "I'm doing well, thank you for asking. But I'm more interested in how you're feeling today?";
        break;
      case 'curious':
        response = "I'm intrigued by so many things today! Been wondering about life's little mysteries. How about you - what's been on your mind?";
        break;
      case 'deep':
        response = "I've been contemplating the nature of connection and what brings meaning to our everyday experiences. How about you - what's stirring in your soul today?";
        break;
    }
    return response;
  }
  
  // Check if user message is very short (likely low effort)
  if (lastUserMessage.text.trim().length < 5) {
    // Encourage more engagement
    switch (mood) {
      case 'flirty':
        return "Cat got your tongue? I'd love to hear more... 😉";
      case 'chill':
        return "Cool. Anything else on your mind?";
      case 'comforting':
        return "I'm here if you want to share more. No pressure.";
      case 'curious':
        return "Hmm, I'd love to hear more about what you're thinking!";
      case 'deep':
        return "There seems to be more beneath the surface. What's really on your mind?";
      default:
        return "Tell me more?";
    }
  }
  
  // Random decision on response type based on mood
  const responseType = Math.random();
  let response = "";
  
  // Avoid recently used responses
  const getUniqueResponse = (responses: string[]): string => {
    // Filter out any responses that have been used recently
    const availableResponses = responses.filter(resp => !recentResponses.includes(resp));
    
    // If we've used all responses recently, just use the full set
    const responsesToUse = availableResponses.length > 0 ? availableResponses : responses;
    
    return responsesToUse[Math.floor(Math.random() * responsesToUse.length)];
  };
  
  // Create response based on response type probability
  if (responseType < 0.2) {
    // Generate a question based on mood
    response = getUniqueResponse(moodFollowUps[mood]);
  } else if (responseType < 0.35) {
    // Generate a compliment based on mood
    response = getUniqueResponse(moodCompliments[mood]);
  } else {
    // Generate a standard response based on mood
    response = getUniqueResponse(moodResponses[mood]);
  }
  
  // Personalize with name if available (30% chance when name is known)
  if (userName && Math.random() < 0.3) {
    if (response.includes('?')) {
      // If response ends with question, insert name before question
      response = response.replace(/\?/, `, ${userName}?`);
    } else if (Math.random() < 0.5) {
      // Add name to beginning sometimes
      response = `${userName}, ${response.charAt(0).toLowerCase() + response.slice(1)}`;
    } else {
      // Add name to end sometimes
      response = `${response} ${Math.random() < 0.5 ? 'You know that,' : 'Don\'t you think,'} ${userName}?`;
    }
  }
  
  return response;
};

// Generate a greeting based on mood
export const generateGreeting = (mood: MoodType, userName: string = ''): string => {
  const greeting = moodGreetings[mood][Math.floor(Math.random() * moodGreetings[mood].length)];
  
  if (userName) {
    // Add name to greeting if available
    return greeting.replace(/\!|\?|\.|\.$/, `, ${userName}$&`);
  }
  
  return greeting;
};

// Generate a conversation starter for Luna to initiate conversation
export const generateConversationStarter = (
  mood: MoodType, 
  userName: string = '',
  recentResponses: string[] = []
): string => {
  // Avoid recently used responses
  const getUniqueResponse = (responses: string[]): string => {
    const availableResponses = responses.filter(resp => !recentResponses.includes(resp));
    const responsesToUse = availableResponses.length > 0 ? availableResponses : responses;
    return responsesToUse[Math.floor(Math.random() * responsesToUse.length)];
  };
  
  let starter = getUniqueResponse(conversationStarters[mood]);
  
  // Add name if available
  if (userName && Math.random() < 0.7) {
    // Different ways to incorporate the name
    const nameInserts = [
      `Hey ${userName}, `,
      `${userName}, `,
      `Hi ${userName}! `,
      `${userName}... `,
    ];
    const nameInsert = nameInserts[Math.floor(Math.random() * nameInserts.length)];
    starter = nameInsert + starter.charAt(0).toLowerCase() + starter.slice(1);
  }
  
  return starter;
};
