export interface ImageGenerationEvent {
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

export type ImageGenerationEventKey = keyof ImageGenerationEvent;
