import { ImageServiceImpl } from '@/infrastructure/image/image.service.impl';
import { ImageRepository } from '@/core/domain/image/image.repository';
import { Image } from '@/core/domain/image/image';
import { Mock } from 'vitest';
import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';

vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-nanoid',
}));

describe('ImagesServiceImpl', () => {
  let imagesService: ImageServiceImpl;
  let mockImageRepository: ImageRepository;

  beforeEach(() => {
    mockImageRepository = {
      saveImage: vi.fn(),
      getImageByEventIdAndUserId: vi.fn(),
      getEventPromotedImages: vi.fn(),
    };

    imagesService = new ImageServiceImpl(
      mockImageRepository as unknown as ImageRepository
    );
  });

  describe('getEventPromotedImages', () => {
    it('should return event promoted image', async () => {
      const eventId = 'event-id';

      const fakePromotedImages = [
        new ImageWithPromptTextAndAuthorDto({
          id: '1',
          author: 'test',
          createdAt: new Date(),
          prompt: 'test prompt',
          promptId: '1',
          selected: false,
          url: '',
        }),
      ];

      (mockImageRepository.getEventPromotedImages as Mock).mockResolvedValue(
        fakePromotedImages
      );

      const result = await imagesService.getEventPromotedImages(eventId);

      expect(mockImageRepository.getEventPromotedImages).toHaveBeenCalledWith(
        eventId
      );
      expect(result).toEqual(fakePromotedImages);
    });
  });

  describe('saveImage', () => {
    it('should save and return the image', async () => {
      const promptId = 'prompt456';
      const imageUrl = 'http://example.com/image2.png';

      const mockSavedImage = Image.create(imageUrl, promptId);
      (mockImageRepository.saveImage as Mock).mockResolvedValue(mockSavedImage);

      const result = await imagesService.saveImage(promptId, imageUrl);

      expect(mockImageRepository.saveImage).toHaveBeenCalled();
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
