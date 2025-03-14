import { Subject } from 'rxjs';
import { ImageGenerationMessageEvent } from '@/core/application/image-generation/image-generation-message-event';

export interface ImageGenerationService {
  generateImageFromPrompt(
    eventId: string,
    promptId: string,
    prompt: string
  ): Promise<void>;

  listenForPromptGenerationDone(
    promptId: string,
    progress: Subject<ImageGenerationMessageEvent>
  ): void;
}

export const IMAGE_GENERATION_SERVICE = Symbol('IMAGE_GENERATION_SERVICE');
