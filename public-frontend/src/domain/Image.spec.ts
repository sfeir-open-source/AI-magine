import { Image } from '@/src/domain/Image';

describe('Image', () => {
  describe('isPromoted', () => {
    it('returns true if the image is promoted', () => {
      const image = new Image(
        'id',
        'prompt',
        'url',
        true,
        new Date().toISOString()
      );
      expect(image.isPromoted()).toBe(true);
    });

    it('returns false if the image is not promoted', () => {
      const image = new Image(
        'id',
        'prompt',
        'url',
        false,
        new Date().toISOString()
      );
      expect(image.isPromoted()).toBe(false);
    });
  });
});
