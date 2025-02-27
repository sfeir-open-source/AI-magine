import { Injectable } from '@nestjs/common';
import { ImageGenerationClient } from '@/image-generation/image-generation.client';

@Injectable()
export class PicsumImageGenerationClient implements ImageGenerationClient {
  private async getBase64ImageFromUrl(
    imageUrl: string
  ): Promise<string | ArrayBuffer | null> {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
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
