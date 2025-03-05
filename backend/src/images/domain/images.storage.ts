export const IMAGES_STORAGE = Symbol('IMAGES_STORAGE');

export interface ImagesStorage {
  saveImage(
    bucketName: string,
    fileName: string,
    fileContent: string
  ): Promise<string>;
}
