import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ErrorMessage } from 'src/common/enum/error-message';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async addCategory(categoryRequest: CreateCategoryDto): Promise<number> {
    if (!(await this.validateDuplicateCategory(categoryRequest))) {
      throw new BadRequestException(ErrorMessage.DUPLICATE_CATEGORY_NAME);
    }

    const category = new Category();
    category.name = categoryRequest.name;

    await this.categoryRepository.save(category);
    return category.id;
  }

  async getCategories(): Promise<GetCategoryDto[]> {
    const categories = await this.categoryRepository.find();
    return categories.map((category) => GetCategoryDto.of(category));
  }

  private async validateDuplicateCategory(
    categoryRequest: CreateCategoryDto,
  ): Promise<boolean> {
    const categories = await this.categoryRepository.findBy({
      name: categoryRequest.name,
    });
    return categories.length === 0;
  }
}
