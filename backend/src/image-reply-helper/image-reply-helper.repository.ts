import { Injectable } from '@nestjs/common';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';
import { Image } from 'src/image/entities/image.entity';
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

@Injectable()
export class FindImageRepliesWithUserByImageHelperRepository extends Repository<ImageReply> {
  constructor(private dataSource: DataSource) {
    super(ImageReply, dataSource.createEntityManager());
  }

  async findByImageWithUser(image: Image): Promise<ImageReply[]> {
    return await this.manager
      .createQueryBuilder(ImageReply, 'a')
      .leftJoin('a.image', 'b')
      .leftJoinAndSelect('a.user', 'c')
      .where('b.id=(:id)', { id: image.id })
      .getMany();
  }
}
