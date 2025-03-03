import { Image } from '@/images/images-types';

export const IMAGES_REPOSITORY = Symbol('IMAGES_REPOSITORY');

export interface ImagesRepository {
  saveImage(image: Image): Promise<Image>;

  getImageByPromptId(promptId: string): Promise<Image | undefined>;
}
