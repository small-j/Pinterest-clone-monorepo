import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeleteSaveImageToImageHelperRepository,
  FindSaveImageWithUserHelperRepository,
} from './save-image-helper.repository';
import { SaveImage } from 'src/save-image/entities/save-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaveImage])],
  providers: [
    DeleteSaveImageToImageHelperRepository,
    FindSaveImageWithUserHelperRepository,
  ],
  exports: [
    DeleteSaveImageToImageHelperRepository,
    FindSaveImageWithUserHelperRepository,
  ],
})
export class SaveImageHelperModule {}
