import { Inject, Injectable } from '@nestjs/common';
import {
  IMAGES_REPOSITORY,
  ImagesRepository,
} from '@/images/images-types/images.repository';
import { Image } from 'src/images/images-types';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(IMAGES_REPOSITORY)
    private readonly imageRepository: ImagesRepository
  ) {}

  getImageByPromptId(promptId: string): Promise<Image | undefined> {
    return this.imageRepository.getImageByPromptId(promptId);
  }

  saveImage(promptId: string, imageUrl: string): Promise<Image> {
    return this.imageRepository.saveImage(Image.create(imageUrl, promptId));
  }

  async getImagesByEventAndUser(eventId: string, userId: string) {
    return this.imageRepository.getImageByEventIdAndUserId(eventId, userId);
  }
}
