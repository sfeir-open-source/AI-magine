export type ImageGenerationMessageEvent = {
  data: {
    type: string;
    payload: {
      promptId: string;
      error?: Error;
      imageContent?: string;
    };
  };
};
