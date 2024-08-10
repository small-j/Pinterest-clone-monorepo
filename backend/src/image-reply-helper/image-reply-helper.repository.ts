import { Injectable } from '@nestjs/common';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FindImageReplyWithUserHelperRepository extends Repository<ImageReply> {
  constructor(private dataSource: DataSource) {
    super(ImageReply, dataSource.createEntityManager());
  }

  async findOneWithUser(id: number) {
    return await this.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }
}
