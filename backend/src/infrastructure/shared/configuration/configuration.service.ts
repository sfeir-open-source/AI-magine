import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  getEmailEncryptionKey() {
    return this.configService.get('EMAIL_ENCRYPTION_KEY');
  }

  getEmailEncryptionIV() {
    return this.configService.get('EMAIL_ENCRYPTION_IV');
  }

  getImagenGcpProjectID() {
    return this.configService.get('IMAGEN_GCP_PROJECT_ID', undefined);
  }

  getImagenRegion() {
    return this.configService.get('IMAGEN_REGION', undefined);
  }

  getImagenEnabled() {
    return this.configService.get('IMAGEN_ENABLED', 'false') === 'true';
  }

  getFirestoreEnabled() {
    return this.configService.get('FIRESTORE_ENABLED', 'false') === 'true';
  }

  getSqliteDBPath() {
    return this.configService.get('SQLITE_DB_PATH', ':memory:');
  }

  getFirestoreGcpProjectId() {
    return this.configService.get('FIRESTORE_GCP_PROJECT_ID', undefined);
  }

  getBucketGcpProjectId() {
    return this.configService.get('BUCKET_GCP_PROJECT_ID', undefined);
  }

  getBucketEnabled() {
    return this.configService.get('BUCKET_ENABLED', 'false') === 'true';
  }
}
