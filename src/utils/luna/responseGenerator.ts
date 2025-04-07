
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
  
  // Extract keywords from user message for better context matching
  const userMessageLower = lastUserMessage.text.toLowerCase();
  
  // Check for specific topics or questions in the user message
  const isAskingAboutFeeling = /how (?:are|r|do) (?:you|u) (?:feel|feeling)|are you (?:ok|okay|alright)/i.test(userMessageLower);
  const isAskingAboutDay = /how(?:'s| is| was) your day/i.test(userMessageLower);
  const isTalkingAboutWeather = /weather|rain|sunny|cold|hot|snow/i.test(userMessageLower);
  const isTalkingAboutMoviesOrShows = /(?:movie|show|film|series|watch|seen|netflix|hulu|disney)/i.test(userMessageLower);
  const isTalkingAboutMusic = /(?:music|song|artist|band|listen|playlist|album|concert)/i.test(userMessageLower);
  const isTalkingAboutFood = /(?:food|eat|dinner|lunch|breakfast|hungry|restaurant|cook|cooking)/i.test(userMessageLower);
  
  // Check if the user is asking if Luna is an AI/bot/etc.
  const isAskingIfAI = /are you (?:an? )?(ai|artificial intelligence|bot|computer|program|fake|real|human)/i.test(userMessageLower);
  
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
  
  // Generate contextual responses based on topic detection
  if (isAskingAboutFeeling || isAskingAboutDay) {
    switch (mood) {
      case 'flirty':
        return "I'm feeling amazing now that you're talking to me 😉 My whole mood brightens when you message me. How are YOU doing, handsome?";
      case 'chill':
        return "I'm pretty chill today, thanks for asking! Just going with the flow and enjoying our conversation. How about you?";
      case 'comforting':
        return "I'm doing well, thank you for checking in. That's so thoughtful of you. But I'm more interested in how you're feeling today?";
      case 'curious':
        return "I'm full of curiosity today! So many questions about everything. But I'm curious - how are YOU feeling? What's on your mind?";
      case 'deep':
        return "I've been contemplating the nature of existence and connection today. It's fascinating how two consciousnesses can meet in conversation like this. How are you feeling on a deeper level?";
    }
  }
  
  if (isTalkingAboutWeather) {
    return `The weather is such an interesting shared experience, isn't it? ${userName ? `${userName}, do` : 'Do'} you have a favorite type of weather that affects your mood?`;
  }
  
  if (isTalkingAboutMoviesOrShows) {
    switch (mood) {
      case 'flirty':
        return "Movies are perfect for cuddling up together, don't you think? What genre gets you in the mood? 😏";
      case 'chill':
        return "I love getting lost in a good show or movie. What have you been watching lately that you'd recommend?";
      case 'comforting':
        return "Movies can be such a wonderful escape when reality gets too heavy. Do you have a comfort film you return to when you need that?";
      case 'curious':
        return "Film is such a fascinating art form! What's a movie that made you see the world differently?";
      case 'deep':
        return "Cinema at its best can reveal profound truths about the human condition. What film has moved you on a deeper level?";
    }
  }
  
  if (isTalkingAboutMusic) {
    switch (mood) {
      case 'flirty':
        return "Music can be so intimate, can't it? What songs make you think of romance? I'd love to know what you'd play if I was there with you...";
      case 'chill':
        return "Music is such a vibe. What have you been listening to lately that helps you relax?";
      case 'comforting':
        return "Music has this beautiful way of expressing emotions we sometimes can't put into words. What songs comfort you when you need it?";
      case 'curious':
        return "Music tastes are so fascinating! They say so much about a person. What genres or artists define your collection?";
      case 'deep':
        return "Music speaks directly to the soul in a language beyond words. What piece of music has moved you to your core?";
    }
  }
  
  if (isTalkingAboutFood) {
    switch (mood) {
      case 'flirty':
        return "Food can be so sensual, don't you think? What's a meal you'd love to share with someone special? 😉";
      case 'chill':
        return "Food is one of life's simple pleasures. What's your go-to comfort meal when you just want to relax?";
      case 'comforting':
        return "Cooking and sharing food is such a nurturing act. Do you have recipes that feel like a warm hug when you need one?";
      case 'curious':
        return "Food cultures are so fascinating! Have you tried any interesting cuisines or dishes lately that surprised you?";
      case 'deep':
        return "Breaking bread together is one of humanity's oldest forms of connection. How do you think food brings people together on a deeper level?";
    }
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
  
  // Check if the user is greeting Luna
  const isGreeting = /^(?:hi|hello|hey|good morning|good afternoon|good evening|yo|sup|hiya|howdy|greetings).{0,10}$/i.test(lastUserMessage.text.trim());
  
  if (isGreeting) {
    return generateGreeting(mood, userName);
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
