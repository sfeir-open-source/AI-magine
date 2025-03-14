import { nanoid } from 'nanoid';

export class Prompt {
  id: string;
  eventId: string;
  userId: string;
  prompt: string;

  private constructor(
    id: string,
    eventId: string,
    userId: string,
    prompt: string
  ) {
    if (!id) throw new Error('Id is required');
    if (!eventId) throw new Error('Event id is required');
    if (!userId) throw new Error('User id is required');
    if (!prompt) throw new Error('Prompt is required');

    this.id = id;
    this.eventId = eventId;
    this.userId = userId;
    this.prompt = prompt;
  }

  static from(id: string, eventId: string, userId: string, prompt: string) {
    return new Prompt(id, eventId, userId, prompt);
  }

  static create(eventId: string, userId: string, prompt: string) {
    return new Prompt(nanoid(32), eventId, userId, prompt);
  }
}
