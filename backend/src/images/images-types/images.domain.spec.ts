import { vi } from 'vitest';
import { Image } from '@/images/images-types';

vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-nanoid',
}));

describe('Image Class', () => {
  describe('from method', () => {
    it('should create an Image instance with valid parameters', () => {
      const id = 'test-id';
      const url = 'http://example.com/image.png';
      const promptId = 'prompt-id';
      const createdAt = new Date();

      const image = Image.from(id, url, promptId, createdAt);

      expect(image).toBeInstanceOf(Image);
      expect(image.id).toBe(id);
      expect(image.url).toBe(url);
      expect(image.promptId).toBe(promptId);
      expect(image.createdAt).toBe(createdAt);
    });

    it('should throw an error if id is missing', () => {
      const url = 'http://example.com/image.png';
      const promptId = 'prompt-id';
      const createdAt = new Date();

      expect(() => Image.from('', url, promptId, createdAt)).toThrowError(
        'Id is required'
      );
    });

    it('should throw an error if url is missing', () => {
      const id = 'test-id';
      const promptId = 'prompt-id';
      const createdAt = new Date();

      expect(() => Image.from(id, '', promptId, createdAt)).toThrowError(
        'Url is required'
      );
    });

    it('should throw an error if promptId is missing', () => {
      const id = 'test-id';
      const url = 'http://example.com/image.png';
      const createdAt = new Date();

      expect(() => Image.from(id, url, '', createdAt)).toThrowError(
        'Prompt id is required'
      );
    });

    it('should throw an error if createdAt is missing', () => {
      const id = 'test-id';
      const url = 'http://example.com/image.png';
      const promptId = 'prompt-id';

      expect(() =>
        Image.from(id, url, promptId, null as unknown as Date)
      ).toThrowError('Created at is required');
    });
  });

  describe('create method', () => {
    it('should create an Image instance with generated id and current date', () => {
      const url = 'http://example.com/image.png';
      const promptId = 'prompt-id';
      const beforeCreate = new Date();

      const image = Image.create(url, promptId);

      const afterCreate = new Date();
      expect(image).toBeInstanceOf(Image);
      expect(image.id).toBe('mocked-nanoid');
      expect(image.url).toBe(url);
      expect(image.promptId).toBe(promptId);
      expect(image.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(image.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
    });

    it('should throw an error if url is missing', () => {
      const promptId = 'prompt-id';

      expect(() => Image.create('', promptId)).toThrowError('Url is required');
    });

    it('should throw an error if promptId is missing', () => {
      const url = 'http://example.com/image.png';

      expect(() => Image.create(url, '')).toThrowError('Prompt id is required');
    });
  });
});
