import { nanoid } from 'nanoid';

export class Image {
  id: string;
  url: string;
  promptId: string;
  createdAt: Date;

  private constructor(
    id: string,
    url: string,
    promptId: string,
    createdAt: Date
  ) {
    if (!id) throw new Error('Id is required');
    if (!url) throw new Error('Url is required');
    if (!promptId) throw new Error('Prompt id is required');
    if (!createdAt) throw new Error('Created at is required');

    this.id = id;
    this.url = url;
    this.promptId = promptId;
    this.createdAt = createdAt;
  }

  static from(id: string, url: string, promptId: string, createdAt: Date) {
    return new Image(id, url, promptId, createdAt);
  }

  static create(url: string, promptId: string) {
    return new Image(nanoid(32), url, promptId, new Date());
  }
}
