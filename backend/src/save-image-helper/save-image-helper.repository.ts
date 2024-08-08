import { Injectable } from '@nestjs/common';
import { Image } from 'src/image/entities/image.entity';
import { SaveImage } from 'src/save-image/entities/save-image.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DeleteSaveImageToImageHelperRepository extends Repository<SaveImage> {
  constructor(private dataSource: DataSource) {
    super(SaveImage, dataSource.createEntityManager());
  }

  async deleteSaveImageToImage(image: Image): Promise<void> {
    await this.delete({ image });
  }
}
