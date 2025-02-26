import axios, { AxiosInstance } from 'axios';
import { Event } from '@/src/domain/Event';
import { NewEventPromptRequestBody, EventRepository } from '@/src/domain/EventRepository';

class EventsApi implements EventRepository {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_API_URL,
    });
  }

  async sendPromptForEvent(
    eventId: string,
    payload: NewEventPromptRequestBody
  ): Promise<string> {
    try {
      const response = await this.http.post<{ promptId: string }>(
        `/events/${eventId}/prompt`,
        payload
      );

      return response.data.promptId;
    } catch (e) {
      throw new Error(
        `Failed to send prompt for event with id ${eventId} : ${e}`
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
      throw new Error(`Failed to retrieve event with id ${eventId} : ${e}`);
    }
  }

  listenForPromptGenerationEvent(eventId: string, promptId: string, onEvent: (event: MessageEvent) => void) {
    const eventSource = new EventSource(`/events/${eventId}/prompts/${promptId}`)

    eventSource.onmessage = onEvent
  }
}

export const eventsApi = new EventsApi();
