import { Image } from '@/images/domain';
import { ImageWithPromptTextDto } from '@/images/dto/ImageWithPromptText.dto';
import { ImageWithPromptTextAndAuthorDto } from '@/images/dto/ImageWithPromptTextAndAuthor.dto';

export const IMAGES_REPOSITORY = Symbol('IMAGES_REPOSITORY');

export interface ImagesRepository {
  saveImage(image: Image): Promise<Image>;

  getEventPromotedImages(
    eventId: string
  ): Promise<ImageWithPromptTextAndAuthorDto[]>;

  getImageByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<ImageWithPromptTextDto[]>;
}
