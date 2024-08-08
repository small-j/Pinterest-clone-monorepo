import { Controller, Post, Get, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async addCategory(
    @Body() categoryRequest: CreateCategoryDto,
  ): Promise<number> {
    return await this.categoryService.addCategory(categoryRequest);
  }

  @Get()
  async getCategories(): Promise<GetCategoryDto[]> {
    return await this.categoryService.getCategories();
  }
}
