import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getCategoriesByCategoryName(categoryName: string): Promise<Category[]> {
    return await this.find({
      where: {
        name: Like(`%${categoryName}%`),
      },
    });
  }
}
