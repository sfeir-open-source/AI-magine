import axios, { AxiosInstance } from 'axios';
import { Event } from '@/src/domain/Event';
import {
  CreateEventPromptRequest,
  CreateEventUserRequest,
  EventRepository,
} from '@/src/domain/EventRepository';
import { Image } from '@/src/domain/Image';
import { ImageWithPromptTextAndAuthorDto } from '@/src/providers/events/dto/ImageWithPromptTextAndAuthor.dto';

class EventsApi implements EventRepository {
  private http: AxiosInstance;
  private baseURL = import.meta.env.VITE_BACKEND_API_URL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  async createUserForEvent(
    userPayload: CreateEventUserRequest
  ): Promise<{ id: string }> {
    try {
      const response = await this.http.post<{ id: string }>(
        '/users',
        userPayload
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
  }

  async getImagesForUser(eventId: string, userId: string): Promise<Image[]> {
    try {
      const response = await this.http.get<
        {
          id: string;
          url: string;
          prompt: string;
          createdAt: string;
          selected: boolean;
        }[]
      >(`/events/${eventId}/users/${userId}/images`);

      return response.data.map(
        (backendImage) =>
          new Image(
            backendImage.id,
            backendImage.prompt,
            backendImage.url,
            backendImage.selected,
            backendImage.createdAt
          )
      );
    } catch (e) {
      throw new Error(
        `Failed to retrieve user images : ${(e as Error).message}`
      );
    }
  }

  async promoteUserImage(
    eventId: string,
    userId: string,
    imageId: string
  ): Promise<void> {
    try {
      await this.http.patch(
        `/events/${eventId}/users/${userId}/images/${imageId}/promote`
      );
      return;
    } catch (e) {
      throw new Error(`Failed to promote image : ${(e as Error).message}`);
    }
  }

  async sendPromptForEvent(
    payload: CreateEventPromptRequest
  ): Promise<{ promptId: string; userId: string }> {
    try {
      const response = await this.http.post<{
        id: string;
        eventId: string;
        userId: string;
        prompt: string;
      }>(`/events/${payload.eventId}/prompts`, payload);

      return { promptId: response.data.id, userId: response.data.userId };
    } catch (e) {
      throw new Error(
        `Failed to send prompt for event with id ${payload.eventId} : ${(e as Error).message}`
      );
    }
  }

  async getEventById(eventId: string) {
    try {
      const response = await this.http.get<{
        id: string;
        name: string;
        startDate: string;
        endDate: string;
      }>(`/events/${eventId}`);

      const { id, name, startDate, endDate } = response.data;

      return new Event(id, name, startDate, endDate);
    } catch (e) {
      throw new Error(
        `Failed to retrieve event with id ${eventId} : ${(e as Error).message}`
      );
    }
  }

  async getPromotedImagesForEvent(eventId: string) {
    try {
      const response = await this.http.get<
        { id: string; prompt: string; url: string; author: string }[]
      >(`/events/${eventId}/images/promoted`);

      return response.data.map(
        (element) =>
          new ImageWithPromptTextAndAuthorDto(
            element.id,
            element.url,
            element.prompt,
            element.author
          )
      );
    } catch {
      throw new Error('Failed to get promoted images for event');
    }
  }

  listenForPromptGenerationEvent(
    eventId: string,
    promptId: string,
    onEvent: (event: MessageEvent) => void
  ) {
    const eventSource = new EventSource(
      `${this.baseURL}/events/${eventId}/prompts/${promptId}`
    );

    eventSource.onmessage = onEvent;
  }
}

export const eventsApi = new EventsApi();
