export class Image {
  constructor(
    public id: string,
    public prompt: string,
    public url: string,
    public selected: boolean,
    public createdAt: string
  ) {}
}
