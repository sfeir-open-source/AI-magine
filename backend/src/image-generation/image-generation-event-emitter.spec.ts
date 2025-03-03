import { ImageGenerationEventEmitter } from './image-generation-event-emitter';
import { vi } from 'vitest';

describe('ImageGenerationEventEmitter', () => {
  it('should call the listener when an event is emitted', () => {
    const eventEmitter = new ImageGenerationEventEmitter();
    const listener = vi.fn();
    const payload = { promptId: '1234', imageContent: 'some-image-content' };

    eventEmitter.on('image:generation-done', listener);
    eventEmitter.emit('image:generation-done', payload);

    expect(listener).toHaveBeenCalledWith(payload);
  });

  it('should not call the listener if a different event is emitted', () => {
    const eventEmitter = new ImageGenerationEventEmitter();
    const listener = vi.fn();
    const payload = { promptId: '1234', error: new Error('An error occurred') };

    eventEmitter.on('error', listener);
    eventEmitter.emit('image:generation-done', payload);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should return true when an event is successfully emitted', () => {
    const eventEmitter = new ImageGenerationEventEmitter();
    const listener = vi.fn();
    const payload = { promptId: '1234', imageContent: 'some-image-content' };

    eventEmitter.on('image:generation-done', listener);
    const result = eventEmitter.emit('image:generation-done', payload);

    expect(result).toBe(true);
  });

  it('should return false when emitting an event with no listeners', () => {
    const eventEmitter = new ImageGenerationEventEmitter();
    const payload = { promptId: '1234', imageContent: 'some-image-content' };

    const result = eventEmitter.emit('image:generation-done', payload);

    expect(result).toBe(false);
  });

  it('should handle multiple listeners for the same event', () => {
    const eventEmitter = new ImageGenerationEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const payload = { promptId: '1234', imageContent: 'some-image-content' };

    eventEmitter.on('image:generation-done', listener1);
    eventEmitter.on('image:generation-done', listener2);
    eventEmitter.emit('image:generation-done', payload);

    expect(listener1).toHaveBeenCalledWith(payload);
    expect(listener2).toHaveBeenCalledWith(payload);
  });
});
