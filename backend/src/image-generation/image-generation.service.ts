import { Inject, Injectable } from '@nestjs/common';
import {
  IMAGE_GENERATION_CLIENT,
  ImageGenerationClient,
} from '@/image-generation/image-generation-types/image-generation.client';

@Injectable()
export class ImageGenerationService {
  constructor(
    @Inject(IMAGE_GENERATION_CLIENT)
    private readonly imageGenerationClient: ImageGenerationClient
  ) {}

  async generateImageFromPrompt(prompt: string): Promise<string> {
    return this.imageGenerationClient.generateImageFromPrompt(prompt);
  }
}
