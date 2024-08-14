import { Image } from '../entities/image.entity';
import { GetImageReplyDto } from './get-image-reply.dto';
import { GetImageDto } from './get-image.dto';

export class GetImageDetailDto {
  // TODO: user 정보 추가.
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  imageReplies: GetImageReplyDto[];
  moreImages: GetImageDto[];

  constructor(
    id: number,
    title: string,
    content: string,
    imageUrl: string,
    imageReplies: GetImageReplyDto[],
    moreImages: GetImageDto[],
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.imageReplies = imageReplies;
    this.moreImages = moreImages;
  }

  static of(
    image: Image,
    imageReplyResponses: GetImageReplyDto[],
    moreImages: Image[],
  ): GetImageDetailDto {
    return new GetImageDetailDto(
      image.id,
      image.title,
      image.content,
      image.url,
      imageReplyResponses,
      GetImageDto.of(moreImages),
    );
  }
}
