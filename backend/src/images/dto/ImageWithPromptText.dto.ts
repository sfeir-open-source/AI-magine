export class ImageWithPromptTextDto {
  id: string;
  url: string;
  createdAt: Date;
  selected: boolean;
  promptId: string;
  prompt: string;

  constructor({
    id,
    url,
    createdAt,
    selected,
    promptId,
    prompt,
  }: {
    id: string;
    url: string;
    createdAt: Date;
    selected: boolean;
    promptId: string;
    prompt: string;
  }) {
    this.id = id;
    this.url = url;
    this.createdAt = createdAt;
    this.selected = selected;
    this.promptId = promptId;
    this.prompt = prompt;
  }
}
