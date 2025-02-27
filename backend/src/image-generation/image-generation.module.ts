import { Module } from '@nestjs/common';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import { PicsumImageGenerationClient } from '@/image-generation/picsum.image-generation.client';
import { IMAGE_GENERATION_CLIENT } from '@/image-generation/image-generation.client';

@Module({
  providers: [
    ImageGenerationService,
    {
      provide: IMAGE_GENERATION_CLIENT,
      useClass: PicsumImageGenerationClient,
    },
  ],
  exports: [ImageGenerationService],
})
export class ImageGenerationModule {}
