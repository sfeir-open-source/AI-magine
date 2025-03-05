import { Module } from '@nestjs/common';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import { IMAGE_GENERATION_CLIENT } from '@/image-generation/domain/image-generation.client';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { IMAGE_GENERATION_STATUS_REPOSITORY } from 'src/image-generation/domain';
import { SqliteImageGenerationStatusRepository } from '@/image-generation/sqlite.image-generation-status.repository';
import { SQLiteClient } from '@/config/sqlite-client';
import { ImagesModule } from '@/images/images.module';
import { IMAGES_REPOSITORY } from '@/images/domain/images.repository';
import { SqliteImagesRepository } from '@/images/sqlite.images.repository';
import { ImagesService } from '@/images/images.service';
import { ImagenImageGenerationClient } from '@/image-generation/imagen.image-generation-client';
import { PicsumImageGenerationClient } from '@/image-generation/picsum.image-generation.client';

@Module({
  imports: [ImagesModule],
  providers: [
    ImageGenerationService,
    ImagesService,
    SQLiteClient,
    {
      provide: IMAGE_GENERATION_CLIENT,
      useClass:
        !process.env?.IMAGEN_GCP_PROJECT_ID || !process.env.IMAGEN_REGION
          ? PicsumImageGenerationClient
          : ImagenImageGenerationClient,
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
  exports: [ImageGenerationEngine],
})
export class ImageGenerationModule {}
