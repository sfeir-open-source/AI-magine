import { vi } from 'vitest';
import { Prompt } from '@/prompt/prompt-types/prompt.domain';

vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mockedNanoid'),
}));

describe('Prompt', () => {
  describe('from', () => {
    it('should create a Prompt instance with valid inputs', () => {
      const prompt = Prompt.from('1', 'event1', 'user1', 'Test Prompt');
      expect(prompt).toBeInstanceOf(Prompt);
      expect(prompt.id).toBe('1');
      expect(prompt.eventId).toBe('event1');
      expect(prompt.userId).toBe('user1');
      expect(prompt.prompt).toBe('Test Prompt');
    });

    it('should throw an error if id is missing', () => {
      expect(() => Prompt.from('', 'event1', 'user1', 'Test Prompt')).toThrow(
        'Id is required'
      );
    });

    it('should throw an error if eventId is missing', () => {
      expect(() => Prompt.from('1', '', 'user1', 'Test Prompt')).toThrow(
        'Event id is required'
      );
    });

    it('should throw an error if userId is missing', () => {
      expect(() => Prompt.from('1', 'event1', '', 'Test Prompt')).toThrow(
        'User id is required'
      );
    });

    it('should throw an error if prompt is missing', () => {
      expect(() => Prompt.from('1', 'event1', 'user1', '')).toThrow(
        'Prompt is required'
      );
    });
  });

  describe('create', () => {
    it('should create a Prompt instance with a generated id and valid inputs', () => {
      const prompt = Prompt.create('event1', 'user1', 'Test Prompt');
      expect(prompt).toBeInstanceOf(Prompt);
      expect(prompt.id).toBe('mockedNanoid');
      expect(prompt.eventId).toBe('event1');
      expect(prompt.userId).toBe('user1');
      expect(prompt.prompt).toBe('Test Prompt');
    });

    it('should throw an error if eventId is missing', () => {
      expect(() => Prompt.create('', 'user1', 'Test Prompt')).toThrow(
        'Event id is required'
      );
    });

    it('should throw an error if userId is missing', () => {
      expect(() => Prompt.create('event1', '', 'Test Prompt')).toThrow(
        'User id is required'
      );
    });

    it('should throw an error if prompt is missing', () => {
      expect(() => Prompt.create('event1', 'user1', '')).toThrow(
        'Prompt is required'
      );
    });
  });
});
