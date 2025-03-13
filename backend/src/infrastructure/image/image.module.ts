import { Module } from '@nestjs/common';
import { ImagesController } from '@/infrastructure/image/images.controller';
import { ImageServiceImpl } from '@/infrastructure/image/image.service.impl';
import { IMAGE_SERVICE } from '@/core/application/image/image.service';
import { PersistenceModule } from '@/infrastructure/shared/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ImagesController],
  providers: [{ provide: IMAGE_SERVICE, useClass: ImageServiceImpl }],
  exports: [IMAGE_SERVICE],
})
export class ImageModule {}
