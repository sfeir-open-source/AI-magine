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
    GCPBucketImagesStorage,
    FakeImagesStorage,
    ImagenImageGenerationClient,
    PicsumImageGenerationClient,
    {
      provide: IMAGES_STORAGE,
      inject: [ConfigurationService, GCPBucketImagesStorage, FakeImagesStorage],
      useFactory: (
        configurationService: ConfigurationService,
        gcpStorage: GCPBucketImagesStorage,
        fakeStorage: FakeImagesStorage
      ) => (configurationService.getBucketEnabled() ? gcpStorage : fakeStorage),
    },
    { provide: IMAGE_GENERATION_SERVICE, useClass: ImageGenerationServiceImpl },
    {
      provide: IMAGE_GENERATION_CLIENT,
      inject: [
        ConfigurationService,
        ImagenImageGenerationClient,
        PicsumImageGenerationClient,
      ],
      useFactory: (
        configurationService: ConfigurationService,
        imagenClient: ImagenImageGenerationClient,
        picsumClient: PicsumImageGenerationClient
      ) =>
        configurationService.getImagenEnabled() ? imagenClient : picsumClient,
    },
    ImageGenerationEngine,
    ImageGenerationEventEmitter,
  ],
  exports: [IMAGE_GENERATION_SERVICE],
})
export class ImageGenerationModule {}
