
import { MoodType } from '@/types/luna';
import { flirtyResponses } from './flirtyResponses';
import { chillResponses } from './chillResponses';
import { comfortingResponses } from './comfortingResponses';
import { curiousResponses } from './curiousResponses';
import { deepResponses } from './deepResponses';

export const moodResponses = {
  flirty: flirtyResponses.responses,
  chill: chillResponses.responses,
  comforting: comfortingResponses.responses,
  curious: curiousResponses.responses,
  deep: deepResponses.responses
};

export const moodGreetings = {
  flirty: flirtyResponses.greetings,
  chill: chillResponses.greetings,
  comforting: comfortingResponses.greetings,
  curious: curiousResponses.greetings,
  deep: deepResponses.greetings
};

export const moodFollowUps = {
  flirty: flirtyResponses.followUps,
  chill: chillResponses.followUps,
  comforting: comfortingResponses.followUps,
  curious: curiousResponses.followUps,
  deep: deepResponses.followUps
};

export const moodCompliments = {
  flirty: flirtyResponses.compliments,
  chill: chillResponses.compliments,
  comforting: comfortingResponses.compliments,
  curious: curiousResponses.compliments,
  deep: deepResponses.compliments
};

export const conversationStarters = {
  flirty: flirtyResponses.starters,
  chill: chillResponses.starters,
  comforting: comfortingResponses.starters,
  curious: curiousResponses.starters,
  deep: deepResponses.starters
};
