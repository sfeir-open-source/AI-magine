import { ImagesController } from '@/infrastructure/image/images.controller';
import { Mock } from 'vitest';
import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';
import { Image } from '@/core/domain/image/image';
import { ImageService } from '@/core/application/image/image.service';

describe('ImagesController', () => {
  let imagesController: ImagesController;
  let imagesService: ImageService;

  beforeEach(() => {
    imagesService = {
      getImagesByEventAndUser: vi.fn(),
      promoteImage: vi.fn(),
      getEventPromotedImages: vi.fn(),
    } as unknown as ImageService;

    imagesController = new ImagesController(imagesService);
  });

  describe('getUserEventImages', () => {
    it('should return a list of image', async () => {
      const createdAt = new Date();
      const mockImages = [
        {
          ...Image.from(
            '1',
            'http://example.com/image.png',
            'prompt123',
            createdAt,
            false
          ),
          prompt: 'foobar',
        },
      ];
      vi.spyOn(imagesService, 'getImagesByEventAndUser').mockResolvedValue(
        mockImages
      );

      const result = await imagesController.getUserEventImages(
        'event123',
        'user123'
      );

      expect(result).toEqual([
        {
          id: '1',
          url: 'http://example.com/image.png',
          prompt: 'foobar',
          promptId: 'prompt123',
          selected: false,
          createdAt,
        },
      ]);
    });
  });

  describe('promoteImage', async () => {
    it('should promote an image', async () => {
      (imagesService.promoteImage as Mock).mockResolvedValue(undefined);

      await imagesController.promoteImage('event123', 'user123', 'image123');

      expect(imagesService.promoteImage).toHaveBeenCalledWith(
        'event123',
        'user123',
        'image123'
      );
    });
  });

  describe('getEventPromotedImages', () => {
    it('should return promoted image for an event', async () => {
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

      (imagesService.getEventPromotedImages as Mock).mockResolvedValue(
        fakePromotedImages
      );

      const result = await imagesController.getEventPromotedImages('event123');

      expect(imagesService.getEventPromotedImages).toHaveBeenCalledWith(
        'event123'
      );
      expect(result).toEqual(fakePromotedImages);
    });
  });
});
