import { EventEmitter } from 'node:events';

interface ImageGenerationEvent {
  'image:generation-requested': {
    promptId: string;
    error?: Error;
    imageContent?: string;
    imageURL?: string;
  };
  'image:generation-done': {
    promptId: string;
    error?: Error;
    imageContent: string;
    imageURL?: string;
  };
  'storage:save-requested': {
    promptId: string;
    error?: Error;
    imageContent?: string;
    imageURL?: string;
  };
  'storage:save-done': {
    promptId: string;
    error?: Error;
    imageContent: string;
    imageURL: string;
  };
  error: {
    promptId: string;
    error: Error;
    imageContent?: string;
    imageURL?: string;
  };
  done: {
    promptId: string;
    error?: Error;
    imageContent?: string;
    imageURL?: string;
  };
}

type ImageGenerationEventKey = keyof ImageGenerationEvent;

// TODO: make this implementation smarter to have business events instead of general .emit .on methods
// TODO: use @nestjs/event-emitter for better integration ?
export class ImageGenerationEventEmitter extends EventEmitter {
  emit(
    eventName: ImageGenerationEventKey,
    payload: ImageGenerationEvent[ImageGenerationEventKey]
  ): boolean {
    return super.emit(eventName, payload);
  }

  on(
    eventName: ImageGenerationEventKey,
    listener: (payload: ImageGenerationEvent[ImageGenerationEventKey]) => void
  ): this {
    return super.on(eventName, listener);
  }
}
