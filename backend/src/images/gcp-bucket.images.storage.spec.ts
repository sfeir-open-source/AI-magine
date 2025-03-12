import { GCPBucketImagesStorage } from '@/images/gcp-bucket.images.storage';
import { ConfigurationService } from '@/configuration/configuration.service';
import { Bucket, Storage } from '@google-cloud/storage';

vi.mock('@google-cloud/storage', async (importOriginal) => ({
  ...importOriginal,
  Storage: vi.fn(
    () =>
      ({
        createBucket: vi.fn(),
        bucket: vi.fn().mockReturnValue({
          makePublic: vi.fn(),
          exists: vi.fn().mockResolvedValue(true),
          file: vi.fn().mockReturnValue({
            save: vi.fn(),
            publicUrl: vi.fn().mockReturnValue('mock-public-url'),
          } as unknown as File),
        } as unknown as Bucket),
      }) as unknown as Storage
  ),
}));

describe('GCPBucketImagesStorage', () => {
  let imageStorage: GCPBucketImagesStorage;

  beforeEach(() => {
    vi.clearAllMocks();
    imageStorage = new GCPBucketImagesStorage({
      getBucketGcpProjectId: () => 'mock-project-id',
    } as unknown as ConfigurationService);
    imageStorage.onApplicationBootstrap();
  });

  describe('constructor', () => {
    it('should throw an error if BUCKET_GCP_PROJECT_ID is not set', () => {
      expect(
        () =>
          new GCPBucketImagesStorage({
            getBucketGcpProjectId: () => '',
          } as unknown as ConfigurationService)
      ).toThrowError(new Error('BUCKET_GCP_PROJECT_ID is not set'));
    });
  });

  describe('saveImage', () => {
    it('should save a valid base64 image and return public URL', async () => {
      const validBase64Image =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

      const returnedURL = await imageStorage.saveImage(
        'test-bucket',
        'test-image-name',
        validBase64Image
      );

      expect(returnedURL).toBe('mock-public-url');
    });
  });
});
