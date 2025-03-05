type ImageGenerationMessageEventData = {
  type: string;
  payload: {
    promptId: string;
    error?: Error;
    imageContent?: string;
  };
};

export type ImageGenerationMessageEvent = {
  data: ImageGenerationMessageEventData;
};
