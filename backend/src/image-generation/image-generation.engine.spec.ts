import { vi } from 'vitest';
import { Subject } from 'rxjs';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import {
  ImageGenerationMessageEvent,
  ImageGenerationStatusRepository,
} from '@/image-generation/domain';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import { ImagesService } from '@/images/images.service';
import { ImagesStorage } from '@/images/domain/images.storage';

const mockImageGenerationService = {
  generateImageFromPrompt: vi.fn(),
} as unknown as ImageGenerationService;

const mockImageGenerationStatusRepository = {
  updatePromptGenerationStatus: vi.fn(),
  getPromptGenerationStatus: vi.fn(),
} as unknown as ImageGenerationStatusRepository;

const mockImagesService = {
  saveImage: vi.fn(),
} as unknown as ImagesService;

const mockImagesStorage = {
  saveImage: vi.fn(),
} as unknown as ImagesStorage;

describe('ImageGenerationEngine', () => {
  let engine: ImageGenerationEngine;

  beforeEach(() => {
    engine = new ImageGenerationEngine(
      mockImageGenerationService,
      mockImageGenerationStatusRepository,
      mockImagesService,
      mockImagesStorage
    );
    vi.clearAllMocks();
  });

  describe('processPrompt', () => {
    it('should process prompt and emit correct events', async () => {
      const eventId = 'test-event-id';
      const promptId = 'test-id';
      const prompt = 'test-prompt';
      const generatedImageContent = 'generated-image-base64';
      const imageUrl = 'http://test-url.com/image.png';

      mockImageGenerationService.generateImageFromPrompt = vi
        .fn()
        .mockResolvedValue(generatedImageContent);
      mockImagesStorage.saveImage = vi.fn().mockResolvedValue(imageUrl);
      mockImagesService.saveImage = vi.fn().mockResolvedValue(undefined);
      mockImageGenerationStatusRepository.updatePromptGenerationStatus = vi
        .fn()
        .mockResolvedValue(undefined);

      await engine.processPrompt(eventId, promptId, prompt);

      expect(
        mockImageGenerationStatusRepository.updatePromptGenerationStatus
      ).toHaveBeenCalledWith(promptId, 'image:generation-requested', '');
      expect(
        mockImageGenerationService.generateImageFromPrompt
      ).toHaveBeenCalledWith(prompt);
      expect(mockImagesStorage.saveImage).toHaveBeenCalledWith(
        eventId,
        promptId,
        generatedImageContent
      );
      expect(mockImagesService.saveImage).toHaveBeenCalledWith(
        promptId,
        imageUrl
      );
      expect(
        mockImageGenerationStatusRepository.updatePromptGenerationStatus
      ).toHaveBeenCalledWith(promptId, 'done', '');
    });

    it('should emit error event if an error occurs in the process', async () => {
      const eventId = 'test-event-id';
      const promptId = 'test-id';
      const prompt = 'test-prompt';
      const error = new Error('Test Error');

      mockImageGenerationService.generateImageFromPrompt = vi
        .fn()
        .mockRejectedValue(error);
      const emitSpy = vi.spyOn(engine['emitter'], 'emit');

      await engine.processPrompt(eventId, promptId, prompt);

      expect(emitSpy).toHaveBeenCalledWith('error', { promptId, error });
    });
  });

  describe('listenForPromptGenerationDone', () => {
    it('should emit events to subject on generation process', () => {
      const promptId = 'test-id';
      const subject = new Subject<ImageGenerationMessageEvent>();
      const mockObserver = vi.fn();
      subject.subscribe(mockObserver);

      engine.listenForPromptGenerationDone(promptId, subject);

      engine['emitter'].emit('image:generation-requested', { promptId });
      engine['emitter'].emit('image:generation-done', {
        promptId,
        imageContent: 'test-image',
      });
      engine['emitter'].emit('done', { promptId });

      expect(mockObserver).toHaveBeenCalledWith({
        data: { type: 'image:generation-requested', payload: { promptId } },
      });
      expect(mockObserver).toHaveBeenCalledWith({
        data: {
          type: 'image:generation-done',
          payload: { promptId, imageContent: 'test-image' },
        },
      });
      expect(mockObserver).toHaveBeenCalledWith({
        data: { type: 'done', payload: { promptId } },
      });
    });

    it('should complete subject on error ', () => {
      const promptId = 'test-id';
      const subject = new Subject<ImageGenerationMessageEvent>();
      const mockObserver = vi.fn();
      const errorPayload = { promptId, error: new Error('Error occurred') };
      subject.subscribe(mockObserver);

      engine.listenForPromptGenerationDone(promptId, subject);

      engine['emitter'].emit('error', errorPayload);

      expect(mockObserver).toHaveBeenCalledWith({
        data: { type: 'error', payload: errorPayload },
      });
    });
  });

  describe('generateImageFromPrompt', () => {
    it('should emit "image:generation-requested" and "image:generation-done"', async () => {
      const promptId = 'test-id';
      const prompt = 'test-prompt';
      const imageContent = 'test-generated-image';

      const emitSpy = vi.spyOn(engine['emitter'], 'emit');
      mockImageGenerationService.generateImageFromPrompt = vi
        .fn()
        .mockResolvedValue({ imageContent });

      const result = await engine['generateImageFromPrompt'](promptId, prompt);

      expect(emitSpy).toHaveBeenCalledWith('image:generation-requested', {
        promptId,
      });
      expect(
        mockImageGenerationService.generateImageFromPrompt
      ).toHaveBeenCalledWith(prompt);
      expect(result.imageContent).toStrictEqual({ imageContent });
    });
  });

  describe('saveImage', () => {
    it('should emit "storage:save-requested" and properly save the image', async () => {
      const eventId = 'test-event-id';
      const promptId = 'test-id';
      const imageContent = 'test-image-content';
      const imageUrl = 'http://test-url.com/image.png';

      const emitSpy = vi.spyOn(engine['emitter'], 'emit');
      mockImagesStorage.saveImage = vi
        .fn()
        .mockResolvedValue({ imageURL: imageUrl });

      const result = await engine['saveImage'](eventId, promptId, imageContent);

      expect(emitSpy).toHaveBeenCalledWith('storage:save-requested', {
        promptId,
        imageContent,
      });
      expect(mockImagesStorage.saveImage).toHaveBeenCalledWith(
        eventId,
        promptId,
        imageContent
      );
      expect(emitSpy).toHaveBeenCalledWith('storage:save-requested', {
        promptId,
        imageContent,
      });
      expect(result.imageURL).toStrictEqual({ imageURL: imageUrl });
    });
  });
});
