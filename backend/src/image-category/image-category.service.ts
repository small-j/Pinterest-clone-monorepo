import { Injectable } from '@nestjs/common';
import { CreateImageCategoryDto } from './dto/create-image-category.dto';

@Injectable()
export class ImageCategoryService {
  create(createImageCategoryDto: CreateImageCategoryDto) {
    return 'This action adds a new imageCategory';
  }

  findAll() {
    return `This action returns all imageCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageCategory`;
  }
}
