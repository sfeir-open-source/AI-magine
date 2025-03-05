import { EventEmitter } from 'node:events';
import {
  ImageGenerationEvent,
  ImageGenerationEventKey,
} from '@/image-generation/domain/image-generation-event.domain';

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
