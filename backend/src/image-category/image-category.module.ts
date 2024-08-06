import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageCategory } from './entities/image-category.entity';
import { ImageCategoryRepository } from './image-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImageCategory])],
  providers: [ImageCategoryRepository],
  exports: [ImageCategoryRepository],
})
export class ImageCategoryModule {}
