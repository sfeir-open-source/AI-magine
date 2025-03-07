import { Module } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { IMAGES_REPOSITORY } from '@/images/domain/images.repository';
import { SqliteImagesRepository } from '@/images/sqlite.images.repository';
import { ImagesService } from '@/images/images.service';
import { ImagesController } from '@/images/images.controller';
import { FirestoreImagesRepository } from '@/images/firestore.images.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { ConfigurationService } from '@/configuration/configuration.service';

@Module({
  providers: [
    ImagesService,
    SQLiteClient,
    FirestoreClient,
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
  ],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}
