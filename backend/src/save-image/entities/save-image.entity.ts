import { BaseTime } from 'src/common/entities/base-time';
import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
@Unique('IMAGE_USER_UNIQUE', ['image', 'user'])
export class SaveImage {
  @PrimaryGeneratedColumn({ name: 'save_image_id' })
  id: number;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  @ManyToOne(() => Image)
  @JoinColumn({ name: 'image_meta_id' })
  image: Image;

  @ManyToOne(() => User, (user) => user.saveImages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(image?: Image, user?: User) {
    if (image) this.image = image;
    if (user) this.user = user;
  }

  static createSaveImage(user: User, image: Image): SaveImage {
    const saveImage = new SaveImage(image, user);
    user.addSaveImage(saveImage);
    return saveImage;
  }
}
