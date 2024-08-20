import { User } from 'src/user/entities/user.entity';
import { ImageReply } from '../entities/image-reply.entity';

export class GetImageReplyDto {
  id: number;
  content: string;
  userId: number;
  userName: string;

  constructor(id: number, content: string, userId: number, userName: string) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.userName = !userName ? '' : userName;
  }

  static of(imageReply: ImageReply, user: User): GetImageReplyDto {
    return new GetImageReplyDto(
      imageReply.id,
      imageReply.content,
      user.id,
      user.name,
    );
  }
}
