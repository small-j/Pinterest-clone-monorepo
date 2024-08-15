import { User } from '../entities/user.entity';

export class UsereDto {
  id: number;
  name: string;
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static of(user: User): UsereDto {
    return new UsereDto(user.id, user.name, user.email);
  }
}
