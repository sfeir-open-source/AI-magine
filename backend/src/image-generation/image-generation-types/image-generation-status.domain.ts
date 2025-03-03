import { nanoid } from 'nanoid';

export class ImageGenerationStatus {
  id: string;
  promptId: string;
  status: string;
  payload: string;
  updatedAt: Date;

  private constructor(
    id: string,
    promptId: string,
    status: string,
    payload: string,
    updatedAt: Date = new Date()
  ) {
    if (!id) throw new Error('Id is required');
    if (!promptId) throw new Error('Prompt id is required');
    if (!status) throw new Error('Status is required');

    this.id = id;
    this.promptId = promptId;
    this.status = status;
    this.payload = payload;
    this.updatedAt = updatedAt;
  }

  static from(
    id: string,
    promptId: string,
    status: string,
    payload: string,
    updatedAt: Date
  ) {
    return new ImageGenerationStatus(id, promptId, status, payload, updatedAt);
  }

  static create(promptId: string, status: string, payload: string) {
    return new ImageGenerationStatus(
      nanoid(32),
      promptId,
      status,
      payload,
      new Date()
    );
  }
}
