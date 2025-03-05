import { Inject, Injectable } from '@nestjs/common';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import { Subject } from 'rxjs';
import {
  IMAGE_GENERATION_STATUS_REPOSITORY,
  ImageGenerationMessageEvent,
  ImageGenerationStatusRepository,
} from 'src/image-generation/domain';
import { ImageGenerationEventEmitter } from '@/image-generation/image-generation-event-emitter';
import { ImagesService } from '@/images/images.service';

@Injectable()
export class ImageGenerationEngine {
  private emitter: ImageGenerationEventEmitter;

  constructor(
    private readonly imageGenerationService: ImageGenerationService,
    @Inject(IMAGE_GENERATION_STATUS_REPOSITORY)
    private readonly imageGenerationStatusRepository: ImageGenerationStatusRepository,
    private readonly imagesService: ImagesService
  ) {
    this.emitter = new ImageGenerationEventEmitter();
    this.emitter.on('image:generation-requested', async (payload) => {
      return this.imageGenerationStatusRepository.updatePromptGenerationStatus(
        payload.promptId,
        'image:generation-requested',
        ''
      );
    });
    this.emitter.on('image:generation-done', async (payload) => {
      return this.imageGenerationStatusRepository.updatePromptGenerationStatus(
        payload.promptId,
        'image:generation-done',
        payload.imageContent ?? ''
      );
    });
    this.emitter.on('error', async (payload) => {
      return this.imageGenerationStatusRepository.updatePromptGenerationStatus(
        payload.promptId,
        'error',
        JSON.stringify(payload?.error ?? '{}')
      );
    });
    this.emitter.on('done', async (payload) => {
      return this.imageGenerationStatusRepository.updatePromptGenerationStatus(
        payload.promptId,
        'done',
        ''
      );
    });
  }

  async processPrompt(promptId: string, prompt: string) {
    try {
      const { imageContent } = await this.generateImageFromPrompt(
        promptId,
        prompt
      );

      await this.imagesService.saveImage(promptId, imageContent);

      this.emitter.emit('done', { promptId });
    } catch (error) {
      this.emitter.emit('error', { promptId, error });
    }
  }

  listenForPromptGenerationDone(
    promptId: string,
    subject: Subject<ImageGenerationMessageEvent>
  ) {
    this.emitter.on('image:generation-requested', (payload) => {
      subject.next({
        data: { type: 'image:generation-requested', payload },
      });
    });

    this.emitter.on('image:generation-done', (payload) => {
      if (payload?.promptId === promptId) {
        subject.next({
          data: {
            type: 'image:generation-done',
            payload,
          },
        });
      }
    });

    this.emitter.on('error', (payload) => {
      subject.next({ data: { type: 'error', payload } });
      subject.complete();
    });

    this.emitter.on('done', () => {
      subject.next({ data: { type: 'done', payload: { promptId } } });
      subject.complete();
    });
  }

  private async generateImageFromPrompt(promptId: string, prompt: string) {
    this.emitter.emit('image:generation-requested', {
      promptId,
    });
    const imageContent =
      await this.imageGenerationService.generateImageFromPrompt(prompt);
    this.emitter.emit('image:generation-done', {
      promptId,
      imageContent,
    });
    return { promptId, prompt, imageContent };
  }
}
