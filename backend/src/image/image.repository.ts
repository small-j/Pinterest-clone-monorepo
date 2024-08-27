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

  async findImageWithUserWithImageCategory(id: number): Promise<Image> {
    return await this.findOne({
      where: { id },
      relations: ['user', 'imageCategories'],
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

  async getRecommendRandomImages(
    categories: Category[],
    size: number,
    page: number,
    seed: number,
  ): Promise<{ data: Image[]; count: number }> {
    await this.manager.query(`SELECT setseed(${seed});`);
    const query = this.manager
      .createQueryBuilder(Image, 'a')
      .innerJoin('a.imageCategories', 'b');

    if (categories.length !== 0)
      query.where('b.category.id IN (:...categoryIds)', {
        categoryIds: categories.map((imageCategory) => imageCategory.id),
      });
    query.groupBy('a.id');

    const count = await query.getCount();

    query.addSelect('RANDOM()', 'random_order');
    query.orderBy('random_order');

    query.skip((page - 1) * size);
    query.take(size);

    const data = await query.getMany();

    return { data, count };
  }

  async getImagesByTitleOrContentOrCategories(
    searchStr: string,
    categories: Category[],
    size: number,
    page: number,
  ): Promise<{ data: Image[]; count: number }> {
    const query = this.manager
      .createQueryBuilder(Image, 'i')
      .innerJoin('i.imageCategories', 'ic')
      .where('i.title LIKE :searchStr', { searchStr: `%${searchStr}%` })
      .orWhere('i.content LIKE :searchStr', { searchStr: `%${searchStr}%` });

    if (categories.length !== 0)
      query.orWhere('ic.category.id IN (:...categoryIds)', {
        categoryIds: categories.map((category) => category.id),
      });

    query.groupBy('i.id');

    const count = await query.getCount();

    const data = await query
      .orderBy('i.baseTime.createdDate', 'DESC')
      .limit(size)
      .offset((page - 1) * size)
      .getMany();

    return { data, count };
  }
}
