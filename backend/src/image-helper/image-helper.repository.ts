import { Injectable } from '@nestjs/common';
import { Image } from 'src/image/entities/image.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FindImageWithUserHelperRepository extends Repository<Image> {
  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }

  async findOneWithUser(id: number): Promise<Image> {
    return await this.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }
}
