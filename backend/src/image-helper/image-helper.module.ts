import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/image/entities/image.entity';
import { FindImageWithUserHelperRepository } from './image-helper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [FindImageWithUserHelperRepository],
  exports: [FindImageWithUserHelperRepository],
})
export class ImageHelperModule {}
