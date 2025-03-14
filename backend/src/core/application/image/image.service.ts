import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';
import { Image } from '@/core/domain/image/image';
import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';

export interface ImageService {
  getEventPromotedImages(
    eventId: string
  ): Promise<ImageWithPromptTextAndAuthorDto[]>;

  saveImage(promptId: string, imageUrl: string): Promise<Image>;

  getImagesByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<ImageWithPromptTextDto[]>;

  promoteImage(
    eventId: string,
    userId: string,
    imageId: string
  ): Promise<Image | undefined>;
}

export const IMAGE_SERVICE = Symbol('IMAGE_SERVICE');
