import { Event } from '@/src/domain/Event';
import { Image } from '@/src/domain/Image';

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

  getImagesForUser(eventId: string, userId: string): Promise<Image[]>;

  promoteUserImage(
    eventId: string,
    userId: string,
    imageId: string
  ): Promise<void>;

  listenForPromptGenerationEvent(
    eventId: string,
    promptId: string,
    onEvent: (event: MessageEvent) => void
  ): void;
}
