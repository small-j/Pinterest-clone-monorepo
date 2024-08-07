import { Injectable } from '@nestjs/common';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GetImageRepliesFromUserHelperRepository extends Repository<ImageReply> {
  constructor(private dataSource: DataSource) {
    super(ImageReply, dataSource.createEntityManager());
  }

  async getImageRepliesFromImage(): Promise<ImageReply[]> {
    return await this.find({
      relations: {
        image: true,
      },
    });
  }
}
