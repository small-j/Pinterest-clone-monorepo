import { User } from 'src/user/entities/user.entity';
import { Image } from '../entities/image.entity';
import { GetImageReplyDto } from './get-image-reply.dto';
import { GetImageDto } from './get-image.dto';

export class GetImageDetailDto {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  userId: number;
  userName: string;
  userEmail: string;
  imageReplies: GetImageReplyDto[];
  moreImages: GetImageDto[];

  constructor(
    id: number,
    title: string,
    content: string,
    imageUrl: string,
    userId: number,
    userName: string,
    userEmail: string,
    imageReplies: GetImageReplyDto[],
    moreImages: GetImageDto[],
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.userName = !userName ? '' : userName;
    this.userEmail = userEmail;
    this.imageReplies = imageReplies;
    this.moreImages = moreImages;
  }

  static of(
    image: Image,
    user: User,
    imageReplyResponses: GetImageReplyDto[],
    moreImages: Image[],
  ): GetImageDetailDto {
    return new GetImageDetailDto(
      image.id,
      image.title,
      image.content,
      image.url,
      user.id,
      user.name,
      user.email,
      imageReplyResponses,
      GetImageDto.of(moreImages),
    );
  }
}
