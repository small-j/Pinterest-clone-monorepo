import { Module } from '@nestjs/common';
import { SaveImageService } from './save-image.service';
import { SaveImageController } from './save-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveImage } from './entities/save-image.entity';
import { SaveImageRepository } from './save-image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SaveImage])],
  controllers: [SaveImageController],
  providers: [SaveImageService, SaveImageRepository],
  exports: [SaveImageRepository],
})
export class SaveImageModule {}
