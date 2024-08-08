import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SaveImage } from './entities/save-image.entity';

@Injectable()
export class SaveImageRepository extends Repository<SaveImage> {
  constructor(private dataSource: DataSource) {
    super(SaveImage, dataSource.createEntityManager());
  }
}
