import { Module } from '@nestjs/common';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import { IMAGE_GENERATION_CLIENT } from '@/image-generation/image-generation-types/image-generation.client';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { IMAGE_GENERATION_STATUS_REPOSITORY } from '@/image-generation/image-generation-types';
import { SqliteImageGenerationStatusRepository } from '@/image-generation/sqlite.image-generation-status.repository';
import { SQLiteClient } from '@/config/sqlite-client';
import { ImagesModule } from '@/images/images.module';
import { IMAGES_REPOSITORY } from '@/images/images-types/images.repository';
import { SqliteImagesRepository } from '@/images/sqlite.images.repository';
import { ImagesService } from '@/images/images.service';
import { ImagenImageGenerationClient } from '@/image-generation/imagen.image-generation-client';

@Module({
  imports: [ImagesModule],
  providers: [
    ImageGenerationService,
    ImagesService,
    SQLiteClient,
    {
      provide: IMAGE_GENERATION_CLIENT,
      useClass: ImagenImageGenerationClient,
    },
    {
      provide: IMAGE_GENERATION_STATUS_REPOSITORY,
      useClass: SqliteImageGenerationStatusRepository,
    },
    {
      provide: IMAGES_REPOSITORY,
      useClass: SqliteImagesRepository,
    },
    ImageGenerationEngine,
  ],
  exports: [ImageGenerationService, ImageGenerationEngine],
})
export class ImageGenerationModule {}
