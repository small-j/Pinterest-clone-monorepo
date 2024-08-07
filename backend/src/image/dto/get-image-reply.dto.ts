import { ImageReply } from 'src/image-reply/entities/image-reply.entity';

export class GetImageReplyDto {
  replyId: number;
  replyContent: string;
  userId: number;
  userName: string;

  constructor(
    replyId: number,
    replyContent: string,
    userId: number,
    userName: string,
  ) {
    this.replyId = replyId;
    this.replyContent = replyContent;
    this.userId = userId;
    this.userName = userName;
  }

  static of(imageReply: ImageReply): GetImageReplyDto {
    const user = imageReply.user;
    return new GetImageReplyDto(
      imageReply.id,
      imageReply.content,
      user.id,
      user.name,
    );
  }
}
