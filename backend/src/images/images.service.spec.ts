import { ImagesService } from '@/images/images.service';
import { ImagesRepository } from '@/images/domain/images.repository';
import { Image } from '@/images/domain';
import { Mock } from 'vitest';

const mockImageRepository = {
  getImageByPromptId: vi.fn(),
  saveImage: vi.fn(),
  getImageByEventIdAndUserId: vi.fn(),
};
vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-nanoid',
}));

describe('ImagesService', () => {
  let imagesService: ImagesService;

  beforeEach(() => {
    vi.resetAllMocks();
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

  describe('promoteImage', () => {
    it('should retrieve the image and update it', async () => {
      const createdAt = new Date();
      (
        mockImageRepository.getImageByEventIdAndUserId as Mock
      ).mockResolvedValue([
        {
          id: 'image-id',
          selected: false,
          createdAt,
          promptId: 'prompt-id',
          url: 'http://example.com/image.png',
        },
        {
          id: 'image-id-2',
          selected: true,
          createdAt: new Date(Date.now() - 1000),
          promptId: 'prompt-id-2',
          url: 'http://example.com/image-2.png',
        },
      ] as Image[]);

      const result = await imagesService.promoteImage(
        'event-id',
        'user-id',
        'image-id'
      );

      expect(
        mockImageRepository.getImageByEventIdAndUserId
      ).toHaveBeenCalledWith('event-id', 'user-id');

      expect(mockImageRepository.saveImage).toHaveBeenCalledWith({
        id: 'image-id',
        selected: true,
        createdAt,
        promptId: 'prompt-id',
        url: 'http://example.com/image.png',
      } as Image);

      expect(result).toEqual({
        id: 'image-id',
        selected: true,
        createdAt,
        promptId: 'prompt-id',
        url: 'http://example.com/image.png',
      });
    });
  });
});
