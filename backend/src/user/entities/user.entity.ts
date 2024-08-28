import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Image } from 'src/image/entities/image.entity';
import { UserImageHistory } from 'src/user-image-history/entities/user-image-history.entity';
import { SaveImage } from 'src/save-image/entities/save-image.entity';
import { BaseTime } from 'src/common/entities/base-time';

import * as bcrypt from 'bcryptjs';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  roles: string;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @OneToMany(() => SaveImage, (saveImage) => saveImage.user)
  saveImages: SaveImage[];

  @OneToMany(
    () => UserImageHistory,
    (userImageHistory) => userImageHistory.user,
  )
  userImageHistories: UserImageHistory[];

  constructor(email: string, name: string, password: string, roles: string) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.roles = roles; // TODO: enum 타입으로 리팩토링
  }

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

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    // TODO: password 검사 조건 추가.
    this.password = await bcrypt.hash(this.password, salt);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
