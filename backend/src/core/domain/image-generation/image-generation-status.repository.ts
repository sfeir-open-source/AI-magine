import { ImageGenerationStatus } from '@/core/domain/image-generation/image-generation-status';

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
