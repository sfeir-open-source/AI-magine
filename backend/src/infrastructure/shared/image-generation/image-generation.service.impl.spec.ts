import { ImageGenerationServiceImpl } from '@/infrastructure/shared/image-generation/image-generation.service.impl';
import { ImageGenerationEngine } from '@/infrastructure/shared/image-generation/engine/image-generation.engine';

describe('ImageGenerationServiceImpl', () => {
  let service: ImageGenerationServiceImpl;
  let mockEngine: ImageGenerationEngine;

  beforeEach(async () => {
    mockEngine = {
      processPrompt: vi.fn(),
    } as unknown as ImageGenerationEngine;

    service = new ImageGenerationServiceImpl(mockEngine);
  });

  describe('generateImageFromPrompt', () => {
    it('should generate an image URL from the given prompt', async () => {
      const eventId = 'event-id';
      const promptId = 'prompt-id';
      const prompt = 'A futuristic cityscape';

      await service.generateImageFromPrompt(eventId, promptId, prompt);

      expect(mockEngine.processPrompt).toHaveBeenCalledWith(
        eventId,
        promptId,
        prompt
      );
    });
  });
});
