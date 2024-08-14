import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeleteSaveImageToImageHelperRepository,
  FindSaveImageWithUserHelperRepository,
  FindSaveImgeWithImagesHelperRepository,
} from './save-image-helper.repository';
import { SaveImage } from 'src/save-image/entities/save-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaveImage])],
  providers: [
    DeleteSaveImageToImageHelperRepository,
    FindSaveImageWithUserHelperRepository,
    FindSaveImgeWithImagesHelperRepository,
  ],
  exports: [
    DeleteSaveImageToImageHelperRepository,
    FindSaveImageWithUserHelperRepository,
    FindSaveImgeWithImagesHelperRepository,
  ],
})
export class SaveImageHelperModule {}
