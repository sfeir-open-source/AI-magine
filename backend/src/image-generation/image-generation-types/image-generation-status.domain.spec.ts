import { ImageGenerationStatus } from '@/image-generation/image-generation-types/image-generation-status.domain';

describe('ImageGenerationStatus', () => {
  describe('from', () => {
    it('should create an instance using the from method', () => {
      const id = 'testId';
      const promptId = 'testPromptId';
      const status = 'pending';
      const payload = 'testPayload';
      const updatedAt = new Date();

      const instance = ImageGenerationStatus.from(
        id,
        promptId,
        status,
        payload,
        updatedAt
      );

      expect(instance.id).toBe(id);
      expect(instance.promptId).toBe(promptId);
      expect(instance.status).toBe(status);
      expect(instance.payload).toBe(payload);
      expect(instance.updatedAt).toBe(updatedAt);
    });

    it('should throw an error if id is missing', () => {
      expect(() =>
        ImageGenerationStatus.from(
          '',
          'promptId',
          'failed',
          'payload',
          new Date()
        )
      ).toThrow('Id is required');
    });

    it('should throw an error if promptId is missing', () => {
      expect(() =>
        ImageGenerationStatus.from('id', '', 'failed', 'payload', new Date())
      ).toThrow('Prompt id is required');
    });

    it('should throw an error if status is missing', () => {
      expect(() =>
        ImageGenerationStatus.from('id', 'promptId', '', 'payload', new Date())
      ).toThrow('Status is required');
    });
  });

  describe('create', () => {
    it('should create an instance using the create method with generated id and current date', () => {
      const promptId = 'testPromptId';
      const status = 'in_progress';
      const payload = 'testPayload';

      const instance = ImageGenerationStatus.create(promptId, status, payload);

      expect(instance.id).toHaveLength(32);
      expect(instance.id).toMatch(/^[a-zA-Z0-9_-]+$/);
      expect(instance.promptId).toBe(promptId);
      expect(instance.status).toBe(status);
      expect(instance.payload).toBe(payload);
      expect(instance.updatedAt).toBeInstanceOf(Date);
    });
  });
});
