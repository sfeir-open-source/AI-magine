import { Module } from '@nestjs/common';
import { ImageGenerationServiceImpl } from '@/infrastructure/shared/image-generation/image-generation.service.impl';
import { ImageGenerationEngine } from '@/infrastructure/shared/image-generation/engine/image-generation.engine';
import { ImageModule } from '@/infrastructure/image/image.module';
import { IMAGE_GENERATION_SERVICE } from '@/core/application/image-generation/image-generation.service';
import { IMAGES_STORAGE } from '@/core/domain/image/images.storage';
import { ConfigurationService } from '@/infrastructure/shared/configuration/configuration.service';
import { GCPBucketImagesStorage } from '@/infrastructure/shared/image-generation/storage/gcp/gcp-bucket.images.storage';
import { FakeImagesStorage } from '@/infrastructure/shared/image-generation/storage/fake.images.storage';
import { ImageGenerationEventEmitter } from '@/infrastructure/shared/image-generation/event-emitter/image-generation-event-emitter';
import { IMAGE_GENERATION_CLIENT } from '@/core/domain/image-generation/image-generation.client';
import { ImagenImageGenerationClient } from '@/infrastructure/shared/image-generation/client/imagen.image-generation-client';
import { PicsumImageGenerationClient } from '@/infrastructure/shared/image-generation/client/picsum.image-generation.client';
import { PersistenceModule } from '@/infrastructure/shared/persistence/persistence.module';

@Module({
  imports: [ImageModule, PersistenceModule],
  providers: [
    {
      provide: IMAGES_STORAGE,
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) =>
        configurationService.getBucketEnabled()
          ? new GCPBucketImagesStorage(configurationService)
          : new FakeImagesStorage(),
    },
    { provide: IMAGE_GENERATION_SERVICE, useClass: ImageGenerationServiceImpl },
    {
      provide: IMAGE_GENERATION_CLIENT,
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) =>
        configurationService.getImagenEnabled()
          ? new ImagenImageGenerationClient(configurationService)
          : new PicsumImageGenerationClient(),
    },
    ImageGenerationEngine,
    ImageGenerationEventEmitter,
  ],
  exports: [IMAGE_GENERATION_SERVICE],
})
export class ImageGenerationModule {}
