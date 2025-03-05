import { nanoid } from 'nanoid';

export class Image {
  id: string;
  url: string;
  promptId: string;
  createdAt: Date;
  selected: boolean;

  private constructor(
    id: string,
    url: string,
    promptId: string,
    createdAt: Date,
    selected: boolean = false
  ) {
    if (!id) throw new Error('Id is required');
    if (!url) throw new Error('Url is required');
    if (!promptId) throw new Error('Prompt id is required');
    if (!createdAt) throw new Error('Created at is required');

    this.id = id;
    this.url = url;
    this.promptId = promptId;
    this.createdAt = createdAt;
    this.selected = selected;
  }

  static from(
    id: string,
    url: string,
    promptId: string,
    createdAt: Date,
    selected: boolean
  ) {
    return new Image(id, url, promptId, createdAt, selected);
  }

  static create(url: string, promptId: string, selected: boolean = false) {
    return new Image(nanoid(32), url, promptId, new Date(), selected);
  }
}
