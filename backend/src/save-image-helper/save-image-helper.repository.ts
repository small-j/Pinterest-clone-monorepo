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

@Injectable()
export class FindSaveImageWithUserHelperRepository extends Repository<SaveImage> {
  constructor(private dataSource: DataSource) {
    super(SaveImage, dataSource.createEntityManager());
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
export class FindSaveImgeWithImagesHelperRepository extends Repository<SaveImage> {
  constructor(private dataSource: DataSource) {
    super(SaveImage, dataSource.createEntityManager());
  }

  async findSaveImagesWithImage(saveImages: SaveImage[]): Promise<SaveImage[]> {
    const query = this.manager
      .createQueryBuilder(SaveImage, 'a')
      .innerJoinAndSelect('a.image', 'b');

    if (saveImages.length !== 0)
      query.where('a.id IN (:...saveImageIds)', {
        saveImageIds: saveImages.map((saveImage) => saveImage.id),
      });

    return query.getMany();
  }
}
