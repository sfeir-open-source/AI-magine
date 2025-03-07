import { ImagesStorage } from '@/images/domain/images.storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeImagesStorage implements ImagesStorage {
  saveImage(
    bucketName: string,
    fileName: string,
    fileContent: string
  ): Promise<string> {
    return Promise.resolve(fileContent);
  }
}
