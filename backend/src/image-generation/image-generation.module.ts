import { Module } from '@nestjs/common';
import { ImageGenerationService } from '@/image-generation/image-generation.service';
import { IMAGE_GENERATION_CLIENT } from '@/image-generation/domain/image-generation.client';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { IMAGE_GENERATION_STATUS_REPOSITORY } from '@/image-generation/domain';
import { SqliteImageGenerationStatusRepository } from '@/image-generation/sqlite.image-generation-status.repository';
import { SQLiteClient } from '@/config/sqlite-client';
import { ImagesModule } from '@/images/images.module';
import { IMAGES_REPOSITORY } from '@/images/domain/images.repository';
import { SqliteImagesRepository } from '@/images/sqlite.images.repository';
import { ImagesService } from '@/images/images.service';
import { ImagenImageGenerationClient } from '@/image-generation/imagen.image-generation-client';
import { PicsumImageGenerationClient } from '@/image-generation/picsum.image-generation.client';
import { FirestoreImageGenerationStatusRepository } from '@/image-generation/firestore.image-generation-status.repository';
import { FirestoreImagesRepository } from '@/images/firestore.images.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { IMAGES_STORAGE } from '@/images/domain/images.storage';
import { GCPBucketImagesStorage } from '@/images/gcp-bucket.images.storage';
import { FakeImagesStorage } from '@/images/fake.images.storage';
import { ConfigurationService } from '@/configuration/configuration.service';

@Module({
  imports: [ImagesModule],
  providers: [
    ImageGenerationService,
    ImagesService,
    SQLiteClient,
    FirestoreClient,
    {
      provide: IMAGES_STORAGE,
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) =>
        configurationService.getBucketEnabled()
          ? new GCPBucketImagesStorage(configurationService)
          : new FakeImagesStorage(),
    },
    {
      provide: IMAGE_GENERATION_CLIENT,
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) =>
        configurationService.getImagenEnabled()
          ? new ImagenImageGenerationClient(configurationService)
          : new PicsumImageGenerationClient(),
    },
    {
      provide: IMAGE_GENERATION_STATUS_REPOSITORY,
      inject: [ConfigurationService, FirestoreClient, SQLiteClient],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreClient: FirestoreClient,
        sqliteClient: SQLiteClient
      ) =>
        configurationService.getFirestoreEnabled()
          ? new FirestoreImageGenerationStatusRepository(firestoreClient)
          : new SqliteImageGenerationStatusRepository(sqliteClient),
    },
    {
      provide: IMAGES_REPOSITORY,
      inject: [ConfigurationService, FirestoreClient, SQLiteClient],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreClient: FirestoreClient,
        sqliteClient: SQLiteClient
      ) =>
        configurationService.getFirestoreEnabled()
          ? new FirestoreImagesRepository(firestoreClient)
          : new SqliteImagesRepository(sqliteClient),
    },
    ImageGenerationEngine,
  ],
  exports: [ImageGenerationService, ImageGenerationEngine],
})
export class ImageGenerationModule {}
