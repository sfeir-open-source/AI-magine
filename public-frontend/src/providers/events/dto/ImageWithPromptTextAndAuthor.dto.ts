export class ImageWithPromptTextAndAuthorDto {
  constructor(
    readonly id: string,
    readonly url: string,
    readonly prompt: string,
    readonly author: string
  ) {}
}
