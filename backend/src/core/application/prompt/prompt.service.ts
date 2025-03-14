import { CreatePromptBodyDto } from '@/core/application/prompt/dto/create-prompt.dto';
import { Prompt } from '@/core/domain/prompt/prompt';
import { Subject } from 'rxjs';
import { ImageGenerationMessageEvent } from '@/core/application/image-generation/image-generation-message-event';

export interface PromptService {
  createPrompt(
    promptDto: CreatePromptBodyDto & { eventId: string }
  ): Promise<Prompt>;

  getGenerationStatus(
    promptId: string,
    progress: Subject<ImageGenerationMessageEvent>
  ): void;
}

export const PROMPT_SERVICE = Symbol('PROMPT_SERVICE');
