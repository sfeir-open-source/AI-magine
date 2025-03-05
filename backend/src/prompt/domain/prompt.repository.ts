import { Prompt } from '@/prompt/domain/prompt.domain';

export const PROMPT_REPOSITORY = Symbol('PROMPT_REPOSITORY');

export interface PromptRepository {
  save(prompt: Prompt): Promise<Prompt>;

  countByEventIdAndUserId(eventId: string, userId: string): Promise<number>;
}
