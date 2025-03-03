import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ImageGenerationClient } from '@/image-generation/image-generation-types/image-generation.client';

@Injectable()
export class PicsumImageGenerationClient implements ImageGenerationClient {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly TIMEOUT = 5000; // 5 seconds

  async getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    try {
      const url = new URL(imageUrl);
      if (!url.protocol.startsWith('http')) {
        throw new HttpException(
          'URL protocol must be HTTP or HTTPS',
          HttpStatus.BAD_REQUEST
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(imageUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new HttpException(
          'Failed to fetch image',
          HttpStatus.BAD_REQUEST
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        throw new HttpException(
          'URL must point to an image file',
          HttpStatus.BAD_REQUEST
        );
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > this.MAX_FILE_SIZE) {
        throw new HttpException(
          'Image file is too large',
          HttpStatus.BAD_REQUEST
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.name === 'AbortError') {
        throw new HttpException('Request timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(
        'Failed to process image',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async generateImageFromPrompt(prompt: string): Promise<string> {
    const data = await this.getBase64ImageFromUrl(
      `https://picsum.photos/seed/${encodeURIComponent(prompt)}/200/300`
    );
    if (!data) {
      return '';
    }
    return data.toString();
  }
}
