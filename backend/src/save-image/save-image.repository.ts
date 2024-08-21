import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SaveImage } from './entities/save-image.entity';
import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SaveImageRepository extends Repository<SaveImage> {
  constructor(private dataSource: DataSource) {
    super(SaveImage, dataSource.createEntityManager());
  }

  async findByImageAndUser(image: Image, user: User): Promise<SaveImage> {
    return await this.findOne({
      where: {
        image: { id: image.id },
        user: { id: user.id },
      },
    });
  }
}
