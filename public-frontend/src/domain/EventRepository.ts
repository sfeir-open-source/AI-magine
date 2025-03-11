import { Event } from '@/src/domain/Event';
import { Image } from '@/src/domain/Image';
import { ImageWithPromptTextAndAuthorDto } from '@/src/providers/events/dto/ImageWithPromptTextAndAuthor.dto';

export type CreateEventPromptRequest = {
  eventId: string;
  userId: string;
  prompt: string;
};

export type CreateEventUserRequest = {
  userEmail: string;
  userNickname: string;
  browserFingerprint: string;
  allowContact: boolean;
};

export interface EventRepository {
  getEventById(eventId: string): Promise<Event>;

  createUserForEvent(
    userPayload: CreateEventUserRequest
  ): Promise<{ id: string }>;

  sendPromptForEvent(
    promptPayload: CreateEventPromptRequest
  ): Promise<{ promptId: string }>;

  getImagesForUser(eventId: string, userId: string): Promise<Image[]>;

  promoteUserImage(
    eventId: string,
    userId: string,
    imageId: string
  ): Promise<void>;

  getPromotedImagesForEvent(
    eventId: string
  ): Promise<ImageWithPromptTextAndAuthorDto[]>;

  listenForPromptGenerationEvent(
    eventId: string,
    promptId: string,
    onEvent: (event: MessageEvent) => void
  ): void;
}
