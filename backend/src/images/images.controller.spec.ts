import { vi } from 'vitest';
import { ImagesService } from '@/images/images.service';
import { ImagesController } from '@/images/images.controller';
import { Image } from '@/images/images-types';

describe('ImagesController', () => {
  let imagesController: ImagesController;
  let imagesService: ImagesService;

  beforeEach(() => {
    imagesService = {
      getImagesByEventAndUser: vi.fn(),
    } as unknown as ImagesService;

    imagesController = new ImagesController(imagesService);
  });

  describe('getUserEventImages', () => {
    it('should return a list of images', async () => {
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
});
