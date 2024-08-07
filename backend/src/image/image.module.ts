import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageRepository } from './image.repository';
import { CategoryModule } from 'src/category/category.module';
import { ImageCategoryModule } from 'src/image-category/image-category.module';
import { SaveImageModule } from 'src/save-image/save-image.module';
import { UserModule } from 'src/user/user.module';
import { UserImageHistoryRepository } from 'src/user-image-history/user-image-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    CategoryModule,
    ImageCategoryModule,
    SaveImageModule,
    UserModule,
    UserImageHistoryRepository,
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageRepository],
})
export class ImageModule {}
