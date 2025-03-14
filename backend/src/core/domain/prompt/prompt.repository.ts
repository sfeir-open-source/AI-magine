import { Prompt } from '@/core/domain/prompt/prompt';

export const PROMPT_REPOSITORY = Symbol('PROMPT_REPOSITORY');

export interface PromptRepository {
  save(prompt: Prompt): Promise<Prompt>;

  countByEventIdAndUserId(eventId: string, userId: string): Promise<number>;
}

export interface IFirestorePromptRepository extends PromptRepository {
  getEventPrompts(eventId: string): Promise<Prompt[]>;

  getEventPromptsForUser(eventId: string, userId: string): Promise<Prompt[]>;
}
