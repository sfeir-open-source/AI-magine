export const IMAGE_GENERATION_CLIENT = Symbol('IMAGE_GENERATION_CLIENT');

export interface ImageGenerationClient {
  generateImageFromPrompt(prompt: string): Promise<string>;
}
