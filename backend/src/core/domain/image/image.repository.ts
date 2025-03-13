import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';
import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';
import { Image } from '@/core/domain/image/image';

export const IMAGES_REPOSITORY = Symbol('IMAGES_REPOSITORY');

export interface ImageRepository {
  saveImage(image: Image): Promise<Image>;

  getEventPromotedImages(
    eventId: string
  ): Promise<ImageWithPromptTextAndAuthorDto[]>;

  getImageByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<ImageWithPromptTextDto[]>;
}
