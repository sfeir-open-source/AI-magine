import axios, { AxiosInstance } from 'axios';
import { UserRepository } from '@/src/domain/UserRepository';

class UsersApi implements UserRepository {
  private http: AxiosInstance;
  private baseURL = import.meta.env.VITE_BACKEND_API_URL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  async getRemainingPromptsCountForUserAndEvent(
    userId: string,
    eventId: string
  ): Promise<number> {
    try {
      const response = await this.http.get<{
        spent: number;
        remaining: number;
        allowed: number;
      }>(`/users/${userId}/events/${eventId}/prompts/remaining`);

      return response.data.remaining;
    } catch (e) {
      throw new Error(
        `Failed to get remaining prompts count: ${(e as Error).message}`
      );
    }
  }
}

export const usersApi = new UsersApi();
