import { BaseTime } from 'src/common/entities/base-time';
import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ImageReply {
  @PrimaryGeneratedColumn({ name: 'image_reply_id' })
  id: number;

  @ManyToOne(() => Image, (image) => image.imageReplies, { lazy: true })
  @JoinColumn({ name: 'image_meta_id' })
  image: Image;

  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  content: string;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  constructor(image?: Image, user?: User, content?: string) {
    if (image) this.image = image;
    if (user) this.user = user;
    if (content) this.content = content;
  }

  static create(image: Image, user: User, content: string): ImageReply {
    const imageReply = new ImageReply();
    imageReply.image = image;
    imageReply.user = user;
    imageReply.content = content;
    image.addReply(imageReply);
    return imageReply;
  }
}
