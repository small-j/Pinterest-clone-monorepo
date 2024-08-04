import { BaseTime } from 'src/common/entities/base-time';
import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
export class UserImageHistory {
  @PrimaryGeneratedColumn({ name: 'user_image_history_id' })
  id: number;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  @ManyToOne(() => Image, { lazy: true })
  @JoinColumn({ name: 'image_meta_id' })
  image: Image;

  @ManyToOne(() => User, (user) => user.userImageHistories, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
