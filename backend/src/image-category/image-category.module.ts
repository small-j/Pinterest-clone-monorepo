import { Module } from '@nestjs/common';
import { ImageCategoryService } from './image-category.service';
import { ImageCategoryController } from './image-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageCategory } from './entities/image-category.entity';
import { ImageCategoryRepository } from './image-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImageCategory])],
  controllers: [ImageCategoryController],
  providers: [ImageCategoryService, ImageCategoryRepository],
  exports: [ImageCategoryRepository],
})
export class ImageCategoryModule {}
