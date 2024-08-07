import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import { UserImageHistory } from 'src/user-image-history/entities/user-image-history.entity';
import { ImageCategory } from 'src/image-category/entities/image-category.entity';

@Injectable()
export class ImageRepository extends Repository<Image> {
  em: EntityManager;

  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }

  async addImage(image: Image): Promise<void> {
    await this.save(image);
  }

  async addUserImageHistory(userImageHistory: UserImageHistory): Promise<void> {
    await this.save(userImageHistory);
  }

  async findById(id: number): Promise<Image> {
    return this.findOneBy({ id: id });
  }

  async deleteImage(image: Image): Promise<void> {
    await this.remove(image);
  }

  async findImagesWithSimilarCategories(
    categoryIds: number[],
    imageId: number,
  ): Promise<Image[]> {
    const query = this.manager
      .createQueryBuilder(Image, 'a')
      .innerJoinAndSelect('a.imageCategories', 'b')
      .where('b.categoryId IN (:...categoryIds)', { categoryIds })
      .andWhere('a.id != :imageId', { imageId })
      .groupBy('a.id')
      .orderBy('COUNT(a.id)', 'DESC')
      .addOrderBy('a.createdDate', 'DESC');

    return query.getMany();
  }

  async getImageFromImageHistory(user: User): Promise<Image[]> {
    return this.manager
      .createQueryBuilder(Image, 'i')
      .innerJoin('i.userImageHistories', 'ui')
      .where('ui.user = :user', { user })
      .orderBy('ui.createdDate', 'DESC')
      .limit(10)
      .getMany();
  }

  async getImageCategoryIdFromImages(images: Image[]): Promise<number[]> {
    const query = this.manager
      .createQueryBuilder()
      .select('DISTINCT ic.categoryId', 'categoryId')
      .from(ImageCategory, 'ic')
      .where('ic.image IN (:...images)', { images })
      .getRawMany();

    return (await query).map((row) => row.categoryId);
  }

  async getRecommendRandomImages(categoryIds: number[]): Promise<Image[]> {
    const query = this.manager
      .createQueryBuilder(Image, 'a')
      .innerJoin('a.imageCategories', 'b')
      .where('b.categoryId IN (:...categoryIds)', { categoryIds })
      .groupBy('a.id')
      .orderBy('RANDOM()')
      .limit(30);

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

  async getCategoryRelationalImages(
    imageCategories: ImageCategory[],
  ): Promise<Image[]> {
    const categoryIds = imageCategories.map((ic) => ic.categoryId);
    return this.manager
      .createQueryBuilder(Image, 'i')
      .innerJoin('i.imageCategories', 'ic')
      .where('ic.categoryId IN (:...categoryIds)', { categoryIds })
      .groupBy('i.id')
      .orderBy('i.createdDate', 'ASC')
      .getMany();
  }
}
