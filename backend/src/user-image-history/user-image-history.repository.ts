import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserImageHistory } from './entities/user-image-history.entity';

@Injectable()
export class UserImageHistoryRepository extends Repository<UserImageHistory> {
  constructor(private dataSource: DataSource) {
    super(UserImageHistory, dataSource.createEntityManager());
  }

  async findUserImageHistoriesWithImages(
    userImageHistories: UserImageHistory[],
  ): Promise<UserImageHistory[]> {
    const query = this.manager
      .createQueryBuilder(UserImageHistory, 'a')
      .innerJoinAndSelect('a.image', 'b');

    if (userImageHistories.length !== 0)
      query.where('a.id IN (:...userImageHistoryIds)', {
        userImageHistoryIds: userImageHistories.map(
          (userImageHistory) => userImageHistory.id,
        ),
      });

    return query.getMany();
  }
}
