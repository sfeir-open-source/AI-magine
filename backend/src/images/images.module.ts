import { Module } from '@nestjs/common';
import { IMAGES_REPOSITORY } from '@/images/domain/images.repository';
import { SqliteImagesRepository } from '@/images/repository/sqlite/sqlite-images.repository';
import { ImagesService } from '@/images/images.service';
import { ImagesController } from '@/images/images.controller';
import { FirestoreImagesRepository } from '@/images/repository/firestore/firestore-images.repository';
import { ConfigurationService } from '@/configuration/configuration.service';
import { SqliteImagesModule } from '@/images/repository/sqlite/sqlite-images.module';
import { FirestoreImagesModule } from '@/images/repository/firestore/firestore-images.module';

@Module({
  imports: [SqliteImagesModule, FirestoreImagesModule],
  providers: [
    ImagesService,
    {
      provide: IMAGES_REPOSITORY,
      inject: [
        ConfigurationService,
        SqliteImagesRepository,
        FirestoreImagesRepository,
      ],
      useFactory: (
        configurationService: ConfigurationService,
        sqliteRepo: SqliteImagesRepository,
        firestoreRepo: FirestoreImagesRepository
      ) =>
        configurationService.getFirestoreEnabled() ? firestoreRepo : sqliteRepo,
    },
  ],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}
