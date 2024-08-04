import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ImageCategory } from 'src/image-category/entities/image-category.entity';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';
import { BaseTime } from 'src/common/entities/base-time';

@Entity('image_meta')
export class Image {
  @PrimaryGeneratedColumn({ name: 'image_meta_id' })
  id: number;

  @Column()
  url: string;

  @Column({ name: 'image_key' })
  key: string;

  @Column()
  title: string;

  @Column({ name: 'image_content' })
  content: string;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  @ManyToOne(() => User, (user) => user.images, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ImageReply, (imageReply) => imageReply.image, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  imageReplies: ImageReply[];

  @OneToMany(() => ImageCategory, (imageCategory) => imageCategory.image, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  imageCategories: ImageCategory[];

  addCategory(imageCategory: ImageCategory) {
    if (!this.imageCategories) {
      this.imageCategories = [];
    }
    this.imageCategories.push(imageCategory);
  }

  addReply(imageReply: ImageReply) {
    if (!this.imageCategories) {
      this.imageCategories = [];
    }
    this.imageReplies.push(imageReply);
  }

  setUser(user: User) {
    this.user = user;
    user.addImage(this);
  }
}
