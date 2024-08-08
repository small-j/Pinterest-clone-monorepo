import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ImageCategory } from './entities/image-category.entity';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class ImageCategoryRepository extends Repository<ImageCategory> {
  constructor(private dataSource: DataSource) {
    super(ImageCategory, dataSource.createEntityManager());
  }

  async findImageCategoriesFromImages(
    images: Image[],
  ): Promise<ImageCategory[]> {
    const query = this.manager
      .createQueryBuilder(ImageCategory, 'a')
      .innerJoin('a.image', 'b')
      .innerJoinAndSelect('a.category', 'c');

    if (images.length !== 0)
      query.where('b.id IN (:...imageIds)', {
        imageIds: images.map((image) => image.id),
      });

    return query.getMany();
  }

  async findOneWithCategory(
    imageCategories: ImageCategory[],
  ): Promise<ImageCategory[]> {
    const query = this.createQueryBuilder('a').innerJoinAndSelect(
      'a.category',
      'b',
    );

    if (imageCategories.length !== 0)
      query.where('a.id IN (:...imageCategoryIds)', {
        imageCategoryIds: imageCategories.map(
          (imageCategory) => imageCategory.id,
        ),
      });

    return query.getMany();
  }

  async getImageCategoryFromSearchWord(
    searchStr: string,
  ): Promise<ImageCategory[]> {
    return this.createQueryBuilder('ic')
      .innerJoinAndSelect('ic.category', 'c')
      .where('c.name LIKE :searchStr', { searchStr: `%${searchStr}%` })
      .getMany();
  }
}
