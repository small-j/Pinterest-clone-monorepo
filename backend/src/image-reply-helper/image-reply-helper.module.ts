import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindImageReplyWithUserHelperRepository } from './image-reply-helper.repository';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageReply])],
  providers: [FindImageReplyWithUserHelperRepository],
  exports: [FindImageReplyWithUserHelperRepository],
})
export class ImageReplyHelperModule {}
