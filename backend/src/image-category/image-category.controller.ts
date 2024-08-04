import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ImageCategoryService } from './image-category.service';
import { CreateImageCategoryDto } from './dto/create-image-category.dto';

@Controller('image-category')
export class ImageCategoryController {
  constructor(private readonly imageCategoryService: ImageCategoryService) {}

  @Post()
  create(@Body() createImageCategoryDto: CreateImageCategoryDto) {
    return this.imageCategoryService.create(createImageCategoryDto);
  }

  @Get()
  findAll() {
    return this.imageCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageCategoryService.findOne(+id);
  }
}
