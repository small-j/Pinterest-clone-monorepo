import { User } from 'src/user/entities/user.entity';
import { Image } from '../entities/image.entity';
import { GetImageReplyDto } from './get-image-reply.dto';

export class GetImageDetailDto {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  userId: number;
  userName: string;
  userEmail: string;
  imageReplies: GetImageReplyDto[];

  constructor(
    id: number,
    title: string,
    content: string,
    imageUrl: string,
    userId: number,
    userName: string,
    userEmail: string,
    imageReplies: GetImageReplyDto[],
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.userName = !userName ? '' : userName;
    this.userEmail = userEmail;
    this.imageReplies = imageReplies;
  }

  static of(
    image: Image,
    user: User,
    imageReplyResponses: GetImageReplyDto[],
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
    );
  }
}
