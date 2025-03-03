import { Module } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { IMAGES_REPOSITORY } from '@/images/images-types/images.repository';
import { SqliteImagesRepository } from '@/images/sqlite.images.repository';
import { ImagesService } from '@/images/images.service';

@Module({
  providers: [
    ImagesService,
    SQLiteClient,
    {
      provide: IMAGES_REPOSITORY,
      useClass: SqliteImagesRepository,
    },
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
