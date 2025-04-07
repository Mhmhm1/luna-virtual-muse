
export const extractPreferences = (message: string): Record<string, string> => {
  const preferences: Record<string, string> = {};
  
  // Music preferences
  const musicMatch = message.match(/(?:like|love|enjoy|into|favorite) (?:music|songs|artists?|bands?) (?:like|is|are|by)? ([^.!?]+)/i);
  if (musicMatch) {
    preferences.music = musicMatch[1].trim();
  }
  
  // Food preferences
  const foodMatch = message.match(/(?:like|love|enjoy|favorite) (?:food|dish|meal|cuisine|restaurant) (?:is|are)? ([^.!?]+)/i);
  if (foodMatch) {
    preferences.food = foodMatch[1].trim();
  }
  
  // Hobby preferences
  const hobbyMatch = message.match(/(?:like|love|enjoy|into|hobby|hobbies|pastime) (?:is|are|include|includes)? ([^.!?]+)/i);
  if (hobbyMatch) {
    preferences.hobby = hobbyMatch[1].trim();
  }
  
  // Color preferences
  const colorMatch = message.match(/(?:favorite|like|love) colors? (?:is|are)? ([^.!?]+)/i);
  if (colorMatch) {
    preferences.color = colorMatch[1].trim();
  }
  
  // Movie/Show preferences
  const movieMatch = message.match(/(?:like|love|enjoy|favorite) (?:movies?|shows?|series|films?) (?:is|are)? ([^.!?]+)/i);
  if (movieMatch) {
    preferences.entertainment = movieMatch[1].trim();
  }
  
  return preferences;
};
