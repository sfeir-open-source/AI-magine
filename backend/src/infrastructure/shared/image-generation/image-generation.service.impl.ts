import { Injectable } from '@nestjs/common';
import { ImageGenerationService } from '@/core/application/image-generation/image-generation.service';
import { ImageGenerationEngine } from '@/infrastructure/shared/image-generation/engine/image-generation.engine';
import { ImageGenerationMessageEvent } from '@/core/application/image-generation/image-generation-message-event';
import { Subject } from 'rxjs';

@Injectable()
export class ImageGenerationServiceImpl implements ImageGenerationService {
  constructor(private readonly imageGenerationEngine: ImageGenerationEngine) {}

  listenForPromptGenerationDone(
    promptId: string,
    progress: Subject<ImageGenerationMessageEvent>
  ): void {
    return this.imageGenerationEngine.listenForPromptGenerationDone(
      promptId,
      progress
    );
  }

  async generateImageFromPrompt(
    eventId: string,
    promptId: string,
    prompt: string
  ): Promise<void> {
    return this.imageGenerationEngine.processPrompt(eventId, promptId, prompt);
  }
}
