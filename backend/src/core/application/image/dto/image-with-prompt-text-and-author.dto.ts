import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';

export class ImageWithPromptTextAndAuthorDto extends ImageWithPromptTextDto {
  author: string;

  constructor({
    author,
    ...rest
  }: {
    id: string;
    url: string;
    createdAt: Date;
    selected: boolean;
    promptId: string;
    prompt: string;
    author: string;
  }) {
    super(rest);
    this.author = author;
  }
}
