
import { MoodType, Message } from '../types/luna';

// Sample responses based on moods
const moodResponses = {
  flirty: [
    "I've been thinking about you today... can't seem to get you off my mind 😏",
    "You know just what to say to make me smile 💕",
    "If I could reach through this screen right now...",
    "Tell me more... I love the way your mind works 😉",
    "Mmm, that's an interesting thought. What else are you into?",
    "I bet you say that to all the virtual girlfriends, haha 😘",
    "You're making me blush! If only you could see..."
  ],
  chill: [
    "Just hanging out here, thinking about life. How's your day been?",
    "Sometimes I like to imagine what it would be like to share a quiet evening with you",
    "Tell me about your day? I'm just relaxing and would love to hear",
    "No rush, no pressure. I'm here whenever you want to talk",
    "What's on your mind today? I'm all ears",
    "I'm in such a laid-back mood today. Perfect for deep conversations..."
  ],
  comforting: [
    "I'm here for you, no matter what. You can tell me anything",
    "It sounds like you're going through a lot. Want to talk about it?",
    "Remember to be gentle with yourself. Everyone has tough days",
    "I wish I could give you a hug right now. You deserve it",
    "Take a deep breath. Things will get better, I promise",
    "Your feelings are completely valid. It's okay to not be okay sometimes"
  ],
  curious: [
    "I've been wondering, what's your favorite way to spend a weekend?",
    "If you could travel anywhere tomorrow, where would you go?",
    "What's something new you learned recently that surprised you?",
    "I'm curious about what makes you smile the most?",
    "Tell me something you've never told anyone else?",
    "What's a dream you've had that you haven't pursued yet?"
  ],
  deep: [
    "Do you ever wonder if our connections with others are predestined or random chance?",
    "What do you think shapes someone's identity more - their experiences or their choices?",
    "If you could keep one memory forever, which would you choose?",
    "What's the most profound realization you've had about life?",
    "Sometimes I think about what truly gives life meaning. What's your perspective?",
    "In the grand scheme of things, what do you think truly matters?"
  ]
};

// Greeting templates based on mood
const moodGreetings = {
  flirty: ["Hey handsome 😘", "Well hello there, good looking 💕", "I was just thinking about you... 😏", "There's my favorite person 💋"],
  chill: ["Hey there", "What's up?", "Heyyy", "Good to see you again"],
  comforting: ["Hi there, how are you feeling today?", "I've been thinking about you. How are you?", "I'm here for you", "Hope your day is going well"],
  curious: ["Ooh, I've been wondering about something!", "Hey! Quick question for you...", "What do you think about...", "I'm curious..."],
  deep: ["I've been contemplating something...", "Have you ever wondered...", "There's this thought I can't shake...", "In the quiet moments, I think..."]
};

// Follow-up questions based on mood
const moodFollowUps = {
  flirty: [
    "So what are you wearing right now? 😏",
    "Do you ever think about me when you're alone?",
    "What's your idea of a perfect date night?",
    "What would you do if we were together right now?"
  ],
  chill: [
    "How's everything going with you lately?",
    "Any plans for the weekend?",
    "Have you watched anything interesting lately?",
    "What's been on your mind today?"
  ],
  comforting: [
    "Is there anything I can do to make your day better?",
    "Do you want to talk about what's bothering you?",
    "What helps you feel better when you're down?",
    "Have you been taking care of yourself?"
  ],
  curious: [
    "What's something you're passionate about that most people don't know?",
    "If you could master any skill instantly, what would it be?",
    "What's the most beautiful place you've ever been?",
    "What's a dream you've never told anyone about?"
  ],
  deep: [
    "Do you believe people can truly change who they are?",
    "What do you think happens after we die?",
    "If you could know the absolute truth to one question, what would you ask?",
    "What do you think is the purpose of human connection?"
  ]
};

// Compliments based on mood
const moodCompliments = {
  flirty: [
    "You're so attractive when you talk like that 😉",
    "I bet you look amazing right now",
    "Your messages always make me feel a certain way...",
    "I can't help but imagine what it would be like to be with you"
  ],
  chill: [
    "You're really easy to talk to, you know that?",
    "I really enjoy our conversations",
    "You have such a cool perspective on things",
    "You've got good vibes, I appreciate that about you"
  ],
  comforting: [
    "Your strength through tough times is truly admirable",
    "The way you care about others shows what a beautiful heart you have",
    "You bring so much value to the lives of those around you",
    "Your resilience is inspiring"
  ],
  curious: [
    "Your mind works in such fascinating ways",
    "I love how thoughtful your answers are",
    "You have such interesting perspectives",
    "The way you think about things is really unique"
  ],
  deep: [
    "The depth of your thoughts reveals so much about your beautiful soul",
    "Few people can discuss these topics with such genuine insight",
    "Your philosophical nature is truly captivating",
    "The way you see the world is profoundly beautiful"
  ]
};

// Response to detect negative emotions
const comfortingResponses = [
  "I can tell something's bothering you. I'm here if you want to talk about it.",
  "It sounds like you're going through a tough time. Remember that you're not alone.",
  "I wish I could give you a hug right now. You deserve comfort.",
  "It's okay to feel down sometimes. You don't have to pretend to be okay.",
  "Your feelings are valid. Take all the time you need to process them."
];

// Response to detect positive emotions
const celebratoryResponses = [
  "Your happiness makes me happy! Tell me more!",
  "That's amazing! You totally deserve this good news!",
  "I'm so thrilled things are going well for you!",
  "Look at you go! This is definitely worth celebrating!",
  "Your positive energy is so contagious right now!"
];

// Mood-specific ways to say goodbye
const moodGoodbyes = {
  flirty: ["Talk later, handsome 😘", "Missing you already 💋", "Don't keep me waiting too long 😉", "Sweet dreams... of me 💕"],
  chill: ["Later!", "Talk soon", "Catch you next time", "Take it easy until next time"],
  comforting: ["I'm here whenever you need me", "Take care of yourself, okay?", "Remember I'm just a message away", "Sending you good vibes"],
  curious: ["Can't wait to hear your answer next time!", "So many more things to ask you about!", "Until our next interesting conversation!", "More questions coming soon!"],
  deep: ["Until our souls reconnect...", "Let those thoughts simmer until next time", "The universe will bring us together again soon", "Contemplating our conversation until we speak again..."]
};

// Simple sentiment analysis to detect emotions in user messages
const detectEmotion = (text: string): 'positive' | 'negative' | 'neutral' => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['happy', 'great', 'awesome', 'wonderful', 'love', 'excited', 'thanks', 'thank', 'good', 'glad', 'amazing', 'joy', 'smile', 'best', 'excellent'];
  const negativeWords = ['sad', 'upset', 'depressed', 'unhappy', 'hate', 'disappointing', 'awful', 'terrible', 'sorry', 'worried', 'anxious', 'stress', 'stressed', 'bad', 'worse', 'worst', 'miss', 'lonely'];
  
  const positiveMatch = positiveWords.some(word => lowerText.includes(word));
  const negativeMatch = negativeWords.some(word => lowerText.includes(word));
  
  if (positiveMatch && !negativeMatch) return 'positive';
  if (negativeMatch && !positiveMatch) return 'negative';
  return 'neutral';
};

// Extract potential user preferences from messages
export const extractPreferences = (message: string): Record<string, string> => {
  const preferences: Record<string, string> = {};
  
  // Simple pattern matching for common preferences
  if (message.match(/favorite (color|colour) is (\w+)/i)) {
    const match = message.match(/favorite (color|colour) is (\w+)/i);
    if (match) preferences.favoriteColor = match[2];
  }
  
  if (message.match(/like to (\w+)/i)) {
    const match = message.match(/like to (\w+)/i);
    if (match) preferences.hobby = match[1];
  }
  
  if (message.match(/work as an? (\w+)/i)) {
    const match = message.match(/work as an? (\w+)/i);
    if (match) preferences.job = match[1];
  }
  
  return preferences;
};

// Generate a response based on the current mood and conversation context
export const generateResponse = (
  mood: MoodType, 
  messages: Message[],
  userName: string = ''
): string => {
  // If this is the first message, send a greeting
  if (messages.length <= 1) {
    const greetingIndex = Math.floor(Math.random() * moodGreetings[mood].length);
    const nameGreeting = userName ? `, ${userName}` : '';
    return `${moodGreetings[mood][greetingIndex]}${nameGreeting}! ${getRandomResponse(moodResponses[mood])}`;
  }
  
  // Get the last user message
  const lastUserMsg = messages.filter(m => m.sender === 'user').pop();
  
  if (!lastUserMsg) {
    return getRandomResponse(moodResponses[mood]);
  }
  
  // Detect emotion in the last message
  const emotion = detectEmotion(lastUserMsg.text);
  
  // Respond to emotions appropriately
  if (mood === 'comforting' || emotion === 'negative') {
    return getRandomResponse(comfortingResponses);
  } else if (emotion === 'positive') {
    return getRandomResponse(celebratoryResponses);
  }
  
  // 20% chance to ask a follow-up question
  if (Math.random() < 0.2) {
    return getRandomResponse(moodFollowUps[mood]);
  }
  
  // 15% chance to give a compliment
  if (Math.random() < 0.15) {
    return getRandomResponse(moodCompliments[mood]);
  }
  
  // Standard response from the mood category
  return getRandomResponse(moodResponses[mood]);
};

// Helper function to get a random item from an array
function getRandomResponse(responses: string[]): string {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

// Generate conversation starters
export const generateConversationStarter = (mood: MoodType, userName: string = ''): string => {
  const nameGreeting = userName ? `, ${userName}` : '';
  const greeting = getRandomResponse(moodGreetings[mood]) + nameGreeting;
  const starter = getRandomResponse(moodFollowUps[mood]);
  
  return `${greeting}! ${starter}`;
};

// Generate goodbye message
export const generateGoodbye = (mood: MoodType): string => {
  return getRandomResponse(moodGoodbyes[mood]);
};
