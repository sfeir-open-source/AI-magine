import { describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import {
  IMAGE_GENERATION_CLIENT,
  ImageGenerationClient,
} from '@/image-generation/domain';

describe('ImageGenerationService', () => {
  let service: ImageGenerationService;
  let mockClient: ImageGenerationClient;

  beforeEach(async () => {
    mockClient = {
      generateImageFromPrompt: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageGenerationService,
        { provide: IMAGE_GENERATION_CLIENT, useValue: mockClient },
      ],
    }).compile();

    service = module.get<ImageGenerationService>(ImageGenerationService);
  });

  describe('generateImageFromPrompt', () => {
    it('should generate an image URL from the given prompt', async () => {
      const prompt = 'A futuristic cityscape';
      const expectedImageUrl = 'http://example.com/image.jpg';
      vi.spyOn(mockClient, 'generateImageFromPrompt').mockResolvedValue(
        expectedImageUrl
      );

      const result = await service.generateImageFromPrompt(prompt);

      expect(mockClient.generateImageFromPrompt).toHaveBeenCalledWith(prompt);
      expect(result).toBe(expectedImageUrl);
    });
  });
});
