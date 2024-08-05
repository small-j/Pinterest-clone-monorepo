import { User } from '../entities/user.entity';
import { Image } from 'src/image/entities/image.entity';

export class UserInfoeDto {
  id: number;
  name: string;
  email: string;

  imageUrls: string[];

  constructor(id: number, name: string, email: string, imageUrls: string[]) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.imageUrls = imageUrls;
  }

  static of(user: User, images: Image[]): UserInfoeDto {
    const imageUrls = images.map((image) => image.url);
    return new UserInfoeDto(user.id, user.name, user.email, imageUrls);
  }
}
