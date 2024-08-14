import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findOneWithUserImageHistories(id: number): Promise<User> {
    return await this.findOne({
      where: { id },
      relations: ['userImageHistories'],
    });
  }

  async findOneWithSaveImages(id: number): Promise<User> {
    return await this.findOne({
      where: { id },
      relations: ['saveImages'],
    });
  }
}
