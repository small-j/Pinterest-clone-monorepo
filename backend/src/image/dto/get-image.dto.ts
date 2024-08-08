import { Image } from '../entities/image.entity';

export class GetImageDto {
  id: number;
  url: string;

  constructor(id: number, url: string) {
    this.id = id;
    this.url = url;
  }

  static of(moreImages: Image[]): GetImageDto[] {
    return moreImages.map((image) => new GetImageDto(image.id, image.url));
  }
}
