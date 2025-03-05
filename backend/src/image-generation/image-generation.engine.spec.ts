import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Subject } from 'rxjs';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import {
  ImageGenerationMessageEvent,
  ImageGenerationStatusRepository,
} from 'src/image-generation/domain';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import { ImagesService } from '@/images/images.service';

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

describe('ImageGenerationEngine', () => {
  let engine: ImageGenerationEngine;

  beforeEach(() => {
    engine = new ImageGenerationEngine(
      mockImageGenerationService,
      mockImageGenerationStatusRepository,
      mockImagesService
    );
    vi.clearAllMocks();
  });

  describe('processPrompt', () => {
    it('should process prompt and emit correct events', async () => {
      const promptId = 'test-id';
      const prompt = 'test-prompt';
      const generatedImage = 'test-image';
      mockImageGenerationService.generateImageFromPrompt = vi
        .fn()
        .mockResolvedValue(generatedImage);
      mockImagesService.saveImage = vi.fn().mockResolvedValue(undefined);
      mockImageGenerationStatusRepository.updatePromptGenerationStatus = vi
        .fn()
        .mockResolvedValue(undefined);

      engine.processPrompt(promptId, prompt);

      expect(
        mockImageGenerationStatusRepository.updatePromptGenerationStatus
      ).toHaveBeenCalledWith(promptId, 'image:generation-requested', '');
      expect(
        mockImageGenerationService.generateImageFromPrompt
      ).toHaveBeenCalledWith(prompt);
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

    it('should complete subject on error', () => {
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
      const imageContent = 'test-image';

      mockImageGenerationService.generateImageFromPrompt = vi
        .fn()
        .mockResolvedValue(imageContent);
      mockImageGenerationStatusRepository.updatePromptGenerationStatus = vi
        .fn()
        .mockResolvedValue(undefined);

      const result = await engine['generateImageFromPrompt'](promptId, prompt);

      expect(
        mockImageGenerationService.generateImageFromPrompt
      ).toHaveBeenCalledWith(prompt);
      expect(
        mockImageGenerationStatusRepository.updatePromptGenerationStatus
      ).toHaveBeenCalledWith(promptId, 'image:generation-done', imageContent);
      expect(result).toEqual({ promptId, prompt, imageContent });
    });
  });
});
