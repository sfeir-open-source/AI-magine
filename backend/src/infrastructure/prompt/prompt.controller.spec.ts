import { PromptController } from '@/infrastructure/prompt/prompt.controller';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatePromptBodyDto } from '@/core/application/prompt/dto/create-prompt.dto';
import { PromptService } from '@/core/application/prompt/prompt.service';

describe('PromptController', () => {
  let promptController: PromptController;
  let promptService: PromptService;

  beforeEach(() => {
    promptService = {
      createPrompt: vi.fn(),
    } as unknown as PromptService;

    promptController = new PromptController(promptService);
  });

  describe('getPromptStatus', () => {
    it('should emit the correct event data with eventId and promptId', () => {
      const eventId = 'event123';
      const promptId = 'prompt456';

      const mockObservable = of({
        data: { eventId, promptId, type: 'done' },
      }).pipe(map((event) => event as MessageEvent));

      const intervalMock = vi
        .spyOn(PromptController.prototype as never, 'getPromptStatus')
        .mockReturnValue(mockObservable);

      const result = promptController.getPromptStatus(eventId, promptId);

      expect(result).toBeDefined();
      result.subscribe((event) => {
        expect(event.data.type).toBe('done');
      });

      intervalMock.mockRestore();
    });
  });

  describe('createPrompt', () => {
    it('should call PromptService.createPrompt with correct parameters and return the result', async () => {
      const eventId = 'event123';
      const createDto: CreatePromptBodyDto = {
        userId: 'mock-user-id',
        prompt: 'Test prompt',
      };

      const mockResult = {
        id: 'mock-id',
        userId: 'mock-user-id',
        eventId,
        prompt: createDto.prompt,
      };

      vi.spyOn(promptService, 'createPrompt').mockResolvedValueOnce(mockResult);

      const response = await promptController.createPrompt(eventId, createDto);

      expect(promptService.createPrompt).toHaveBeenCalledTimes(1);
      expect(promptService.createPrompt).toHaveBeenCalledWith({
        ...createDto,
        eventId,
      });
      expect(response).toEqual(mockResult);
    });
  });
});
