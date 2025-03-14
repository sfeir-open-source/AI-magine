import { ImagesStorage } from '@/core/domain/image/images.storage';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigurationService } from '@/infrastructure/shared/configuration/configuration.service';

@Injectable()
export class GCPBucketImagesStorage
  implements ImagesStorage, OnApplicationBootstrap
{
  private storageClient: Storage;
  private readonly bucketNamePrefix = 'sfeirlille-aimagine-v2_';

  constructor(
    @Inject()
    private readonly configurationService: ConfigurationService
  ) {
    if (!configurationService.getBucketGcpProjectId()) {
      throw new Error('BUCKET_GCP_PROJECT_ID is not set');
    }
  }

  onApplicationBootstrap() {
    this.storageClient = new Storage({
      projectId: this.configurationService.getBucketGcpProjectId(),
    });
  }

  private isValidBase64(input: string) {
    try {
      return Buffer.from(input, 'base64').toString('base64') === input;
    } catch {
      return false;
    }
  }

  async saveImage(
    bucketName: string,
    fileName: string,
    fileContent: string
  ): Promise<string> {
    let bucket = this.storageClient.bucket(
      `${this.bucketNamePrefix}${bucketName.toLowerCase()}`
    );
    const bucketExists = await bucket.exists();
    if (!bucketExists[0]) {
      await this.storageClient.createBucket(bucket.name);
      bucket = this.storageClient.bucket(
        `${this.bucketNamePrefix}${bucketName.toLowerCase()}`
      );
      await bucket.makePublic();
    }
    const file = bucket.file(`${fileName}.png`);
    const cleanedFileContent = fileContent.replace(
      /^data:image\/\w+;base64,/,
      ''
    );
    if (!this.isValidBase64(cleanedFileContent)) {
      throw new Error('Invalid base64 input');
    }
    const buffer = Buffer.from(cleanedFileContent, 'base64');

    await file.save(buffer);

    return file.publicUrl();
  }
}
