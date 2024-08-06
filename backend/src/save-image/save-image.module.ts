import { Module } from '@nestjs/common';
import { SaveImageService } from './save-image.service';
import { SaveImageController } from './save-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveImage } from './entities/save-image.entity';
import { SaveImageRepository } from './save-image.repository';
import { ImageModule } from 'src/image/image.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SaveImage]), UserModule, ImageModule],
  controllers: [SaveImageController],
  providers: [SaveImageService, SaveImageRepository],
  exports: [SaveImageRepository],
})
export class SaveImageModule {}
