import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMAGES_REPOSITORY,
  ImageRepository,
} from '@/core/domain/image/image.repository';
import { ImageService } from '@/core/application/image/image.service';
import { Image } from '@/core/domain/image/image';

@Injectable()
export class ImageServiceImpl implements ImageService {
  constructor(
    @Inject(IMAGES_REPOSITORY)
    private readonly imageRepository: ImageRepository
  ) {}

  getEventPromotedImages(eventId: string) {
    return this.imageRepository.getEventPromotedImages(eventId);
  }

  saveImage(promptId: string, imageUrl: string): Promise<Image> {
    return this.imageRepository.saveImage(Image.create(imageUrl, promptId));
  }

  async getImagesByEventAndUser(eventId: string, userId: string) {
    return this.imageRepository.getImageByEventIdAndUserId(eventId, userId);
  }

  async promoteImage(eventId: string, userId: string, imageId: string) {
    const images = await this.imageRepository.getImageByEventIdAndUserId(
      eventId,
      userId
    );

    if (!images) {
      throw new NotFoundException('No image found for this user on this event');
    }

    if (!images.find((image) => image.id === imageId)) {
      throw new NotFoundException('Image not found');
    }

    return images.reduce(async (selectedImage, image) => {
      const currentImage = Image.from(
        image.id,
        image.url,
        image.promptId,
        image.createdAt,
        image.id === imageId
      );
      await this.imageRepository.saveImage(currentImage);
      return currentImage.id !== imageId ? selectedImage : currentImage;
    }, undefined);
  }
}
