import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteSaveImageToImageHelperRepository } from './save-image-helper.repository';
import { SaveImage } from 'src/save-image/entities/save-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaveImage])],
  providers: [DeleteSaveImageToImageHelperRepository],
  exports: [DeleteSaveImageToImageHelperRepository],
})
export class SaveImageHelperModule {}
