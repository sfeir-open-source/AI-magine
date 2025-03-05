import { CreatePromptBodyDto } from '@/prompt/dto/create-prompt.dto';

export type CreatePromptResponseDto = CreatePromptBodyDto & {
  eventId: string;
};
