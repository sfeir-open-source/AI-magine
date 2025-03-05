import { ImageGenerationStatus } from '@/image-generation/domain/image-generation-status.domain';

export const IMAGE_GENERATION_STATUS_REPOSITORY = Symbol(
  'IMAGE_GENERATION_STATUS_REPOSITORY'
);

export interface ImageGenerationStatusRepository {
  getPromptGenerationStatus(
    promptId: string
  ): Promise<ImageGenerationStatus | undefined>;

  updatePromptGenerationStatus(
    promptId: string,
    status: string,
    payload: string
  ): Promise<ImageGenerationStatus>;
}
