import axios, { AxiosInstance } from 'axios';
import { Event } from '@/src/domain/Event';
import {
  CreateEventPayload,
  EventRepository,
  PromotedImage,
} from '@/src/domain/EventRepository';

type ApiEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

class EventsApi implements EventRepository {
  private http: AxiosInstance;
  private baseURL = import.meta.env.VITE_BACKEND_API_URL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  async getEventById(eventId: string) {
    try {
      const response = await this.http.get<ApiEvent>(`/events/${eventId}`);

      const { id, name, startDate, endDate } = response.data;

      return new Event(id, name, startDate, endDate);
    } catch (e) {
      throw new Error(
        `Failed to retrieve event with id ${eventId} : ${(e as Error).message}`
      );
    }
  }

  async getAllEvents() {
    try {
      const response = await this.http.get<ApiEvent[]>(`/events`);

      return response.data.map(
        ({ id, name, startDate, endDate }) =>
          new Event(id, name, startDate, endDate)
      );
    } catch (e) {
      throw new Error(`Failed to retrieve events : ${(e as Error).message}`);
    }
  }

  async createEvent(payload: CreateEventPayload) {
    try {
      const response = await this.http.post<ApiEvent>(`/events`, payload);

      const { id, name, startDate, endDate } = response.data;

      return new Event(id, name, startDate, endDate);
    } catch (e) {
      throw new Error(`Failed to create event : ${(e as Error).message}`);
    }
  }

  async getPromotedImagesForEvent(eventId: string) {
    try {
      const response = await this.http.get<PromotedImage[]>(
        `/events/${eventId}/images/promoted`
      );

      return response.data;
    } catch {
      throw new Error('Failed to get promoted images for the event');
    }
  }

  async getCountEventGenerationRequested(eventId: string) {
    try {
      const response = await this.http.get<number>(
        `/events/${eventId}/prompt/generation-statuses/requests/count`
      );

      return response.data;
    } catch {
      throw new Error('Failed to get generation requests count for the event');
    }
  }

  async getCountEventGenerationDone(eventId: string) {
    try {
      const response = await this.http.get<number>(
        `/events/${eventId}/prompt/generation-statuses/done/count`
      );

      return response.data;
    } catch {
      throw new Error('Failed to get generated images count for the event');
    }
  }

  async getCountEventGenerationError(eventId: string) {
    try {
      const response = await this.http.get<number>(
        `/events/${eventId}/prompt/generation-statuses/error/count`
      );

      return response.data;
    } catch {
      throw new Error('Failed to get errors count for the event');
    }
  }
}

export const eventsApi = new EventsApi();
