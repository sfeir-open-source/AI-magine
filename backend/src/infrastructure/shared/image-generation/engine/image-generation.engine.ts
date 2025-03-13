import { Inject, Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ImageGenerationEventEmitter } from '@/infrastructure/shared/image-generation/event-emitter/image-generation-event-emitter';
import {
  IMAGES_STORAGE,
  ImagesStorage,
} from '@/core/domain/image/images.storage';
import {
  IMAGE_GENERATION_CLIENT,
  ImageGenerationClient,
} from '@/core/domain/image-generation/image-generation.client';
import {
  IMAGE_GENERATION_STATUS_REPOSITORY,
  ImageGenerationStatusRepository,
} from '@/core/domain/image-generation/image-generation-status.repository';
import { ImageGenerationMessageEvent } from '@/core/application/image-generation/image-generation-message-event';
import {
  IMAGE_SERVICE,
  ImageService,
} from '@/core/application/image/image.service';

@Injectable()
export class ImageGenerationEngine {
  private emitter: ImageGenerationEventEmitter;

  constructor(
    @Inject(IMAGE_GENERATION_STATUS_REPOSITORY)
    private readonly imageGenerationStatusRepository: ImageGenerationStatusRepository,
    @Inject(IMAGE_SERVICE)
    private readonly imagesService: ImageService,
    @Inject(IMAGE_GENERATION_CLIENT)
    private readonly imageGenerationClient: ImageGenerationClient,
    @Inject(IMAGES_STORAGE)
    private readonly imagesStorage: ImagesStorage
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
        ''
      );
    });
    this.emitter.on('storage:save-requested', async (payload) => {
      return this.imageGenerationStatusRepository.updatePromptGenerationStatus(
        payload.promptId,
        'storage:save-requested',
        ''
      );
    });
    this.emitter.on('storage:save-done', async (payload) => {
      return this.imageGenerationStatusRepository.updatePromptGenerationStatus(
        payload.promptId,
        'storage:save-done',
        payload.imageURL ?? ''
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

  async processPrompt(eventId: string, promptId: string, prompt: string) {
    try {
      const { imageContent } = await this.generateImageFromPrompt(
        promptId,
        prompt
      );

      const { imageURL } = await this.saveImage(
        eventId,
        promptId,
        imageContent
      );

      await this.imagesService.saveImage(promptId, imageURL);

      this.emitter.emit('done', { promptId, imageURL });
    } catch (error) {
      console.error(error);
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
      await this.imageGenerationClient.generateImageFromPrompt(prompt);
    this.emitter.emit('image:generation-done', {
      promptId,
      imageContent,
    });
    return { promptId, prompt, imageContent };
  }

  private async saveImage(
    eventId: string,
    promptId: string,
    imageContent: string
  ) {
    this.emitter.emit('storage:save-requested', {
      promptId,
      imageContent,
    });
    const imageURL = await this.imagesStorage.saveImage(
      eventId,
      promptId,
      imageContent
    );
    this.emitter.emit('storage:save-done', {
      promptId,
      imageURL,
    });
    return { eventId, promptId, imageContent, imageURL };
  }
}
