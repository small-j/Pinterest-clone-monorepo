import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ImageRepository extends Repository<Image> {
  em: EntityManager;

  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }

  async findImageWithImageReplyWithImageCategory(id: number): Promise<Image> {
    return await this.findOne({
      where: { id },
      relations: ['imageReplies', 'imageCategories'],
    });
  }

  async findImagesWithSimilarCategories(
    categories: Category[],
    imageId: number,
  ): Promise<Image[]> {
    const query = this.manager
      .createQueryBuilder(Image, 'a')
      .innerJoin('a.imageCategories', 'b');

    if (categories.length !== 0)
      query.where('b.category.id IN (:...categoryIds)', {
        categoryIds: categories.map((category) => category.id),
      });

    query
      .having('a.id != :imageId', { imageId })
      .groupBy('a.id')
      .orderBy('COUNT(a.id)', 'DESC')
      .addOrderBy('a.createdDate', 'DESC');

    return query.getMany();
  }

  async getRecommendRandomImages(categories: Category[]): Promise<Image[]> {
    const query = this.manager
      .createQueryBuilder(Image, 'a')
      .innerJoin('a.imageCategories', 'b');

    if (categories.length !== 0)
      query.where('b.category.id IN (:...categoryIds)', {
        categoryIds: categories.map((imageCategory) => imageCategory.id),
      });

    query.groupBy('a.id').orderBy('RANDOM()').limit(30); // TODO: 이게 30개인 이유는?

    return query.getMany();
  }

  async getImageTitleOrContentRelationalImages(
    searchStr: string,
  ): Promise<Image[]> {
    return this.manager
      .createQueryBuilder(Image, 'i')
      .where('i.title LIKE :searchStr', { searchStr: `%${searchStr}%` })
      .orWhere('i.content LIKE :searchStr', { searchStr: `%${searchStr}%` })
      .orderBy('i.createdDate', 'DESC')
      .getMany();
  }

  async getCategoryRelationalImages(categories: Category[]): Promise<Image[]> {
    const query = this.manager
      .createQueryBuilder(Image, 'i')
      .innerJoin('i.imageCategories', 'ic');

    if (categories.length !== 0)
      query.where('ic.category.id IN (:...categoryIds)', {
        categoryIds: categories.map((category) => category.id),
      });

    return query.groupBy('i.id').orderBy('i.createdDate', 'ASC').getMany();
  }
}
