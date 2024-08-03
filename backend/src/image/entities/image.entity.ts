import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ImageReply } from './image-reply.entity';
import { User } from 'src/user/entities/user.entity';
import { ImageCategory } from 'src/image-category/entities/image-category.entity';

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

  @ManyToOne(() => User, (user) => user.images, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ImageReply, (imageReply) => imageReply.image, { cascade: true, orphanedRowAction: 'delete' })
  imageReplies: ImageReply[];

  @OneToMany(() => ImageCategory, (imageCategory) => imageCategory.image, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  imageCategories: ImageCategory[];

  constructor() {
    this.imageReplies = [];
    this.imageCategories = [];
  }

  addCategory(imageCategory: ImageCategory) {
    this.imageCategories.push(imageCategory);
  }

  addReply(imageReply: ImageReply) {
    this.imageReplies.push(imageReply);
  }

  setUser(user: User) {
    this.user = user;
    user.addImage(this);
  }
}
