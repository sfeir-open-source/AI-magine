import { Event } from '@/src/domain/Event';

export type NewEventPromptRequestBody = {
  browserFingerprint: string;
  userEmail: string;
  userName?: string;
  jobTitle?: string;
  allowContact: boolean;
  prompt: string;
};

export interface EventRepository {
  getEventById(eventId: string): Promise<Event>;

  sendPromptForEvent(
    eventId: string,
    payload: NewEventPromptRequestBody
  ): Promise<{ promptId: string; userId: string }>;

  listenForPromptGenerationEvent(
    eventId: string,
    promptId: string,
    onEvent: (event: MessageEvent) => void
  ): void;
}
