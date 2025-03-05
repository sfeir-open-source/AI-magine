import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImagesService } from '@/images/images.service';
import { ImagesRepository } from '@/images/domain/images.repository';
import { Image } from 'src/images/domain';

const mockImageRepository = {
  getImageByPromptId: vi.fn(),
  saveImage: vi.fn(),
};
vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-nanoid',
}));

describe('ImagesService', () => {
  let imagesService: ImagesService;

  beforeEach(() => {
    imagesService = new ImagesService(
      mockImageRepository as unknown as ImagesRepository
    );
  });

  describe('getImageByPromptId', () => {
    it('should return an image by promptId', async () => {
      const promptId = 'prompt123';
      const mockImage = Image.from(
        'id123',
        'http://example.com/image.png',
        promptId,
        new Date(),
        false
      );
      mockImageRepository.getImageByPromptId.mockResolvedValue(mockImage);

      const result = await imagesService.getImageByPromptId(promptId);

      expect(mockImageRepository.getImageByPromptId).toHaveBeenCalledWith(
        promptId
      );
      expect(result).toEqual(mockImage);
    });

    it('should return undefined if no image is found', async () => {
      const promptId = 'nonexistent';
      mockImageRepository.getImageByPromptId.mockResolvedValue(undefined);

      const result = await imagesService.getImageByPromptId(promptId);

      expect(mockImageRepository.getImageByPromptId).toHaveBeenCalledWith(
        promptId
      );
      expect(result).toBeUndefined();
    });
  });

  describe('saveImage', () => {
    it('should save and return the image', async () => {
      const promptId = 'prompt456';
      const imageUrl = 'http://example.com/image2.png';

      const mockSavedImage = Image.create(imageUrl, promptId);
      mockImageRepository.saveImage.mockResolvedValue(mockSavedImage);

      const result = await imagesService.saveImage(promptId, imageUrl);

      expect(mockImageRepository.saveImage).toHaveBeenCalledWith(
        mockSavedImage
      );
      expect(result).toEqual(mockSavedImage);
    });
  });
});
