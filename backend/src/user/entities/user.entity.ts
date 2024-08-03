import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Image } from './Image'; // Make sure to create and import related entities
import { SaveImage } from './SaveImage'; // Make sure to create and import related entities
import { UserImageHistory } from './UserImageHistory'; // Make sure to create and import related entities

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  roles: string;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @OneToMany(() => SaveImage, (saveImage) => saveImage.user)
  saveImages: SaveImage[];

  @OneToMany(
    () => UserImageHistory,
    (userImageHistory) => userImageHistory.user,
  )
  userImageHistories: UserImageHistory[];

  getRoleList(): string[] {
    return this.roles.length > 0 ? this.roles.split(',') : [];
  }

  addImage(image: Image) {
    if (!this.images) {
      this.images = [];
    }
    this.images.push(image);
  }

  addSaveImage(saveImage: SaveImage) {
    if (!this.saveImages) {
      this.saveImages = [];
    }
    this.saveImages.push(saveImage);
  }

  addImageHistory(userImageHistory: UserImageHistory) {
    if (!this.userImageHistories) {
      this.userImageHistories = [];
    }
    this.userImageHistories.push(userImageHistory);
  }
}
