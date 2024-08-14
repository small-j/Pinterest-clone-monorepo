import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserImageHistory } from './entities/user-image-history.entity';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class UserImageHistoryRepository extends Repository<UserImageHistory> {
  constructor(private dataSource: DataSource) {
    super(UserImageHistory, dataSource.createEntityManager());
  }

  async findUserImageHistoriesWithImages(
    userId: number,
  ): Promise<UserImageHistory[]> {
    const query = this.manager
      .createQueryBuilder(UserImageHistory, 'a')
      .innerJoin('a.user', 'c')
      .innerJoinAndSelect('a.image', 'b')
      .where('c.id=(:userId)', { userId });

    return query.getMany();
  }

  async removeUserImageHistoryFromImage(image: Image): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(Image)
      .where('id = :id', { id: image.id })
      .execute();
  }
}
