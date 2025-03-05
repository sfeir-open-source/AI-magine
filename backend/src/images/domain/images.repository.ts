import { Image } from 'src/images/domain';

export const IMAGES_REPOSITORY = Symbol('IMAGES_REPOSITORY');

export interface ImagesRepository {
  saveImage(image: Image): Promise<Image>;

  getImageByPromptId(promptId: string): Promise<Image | undefined>;

  getImageByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<Array<Image & { prompt: string }>>;
}
