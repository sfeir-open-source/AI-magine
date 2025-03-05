export interface ImageGenerationEvent {
  'image:generation-requested': {
    promptId: string;
    error?: Error;
    imageContent?: string;
  };
  'image:generation-done': {
    promptId: string;
    imageContent: string;
    error?: Error;
  };
  error: {
    promptId: string;
    error: Error;
    imageContent?: string;
  };
  done: {
    promptId: string;
    error?: Error;
    imageContent?: string;
  };
}

export type ImageGenerationEventKey = keyof ImageGenerationEvent;
