import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FindImageRepliesWithUserByImageHelperRepository,
  FindImageReplyWithUserHelperRepository,
} from './image-reply-helper.repository';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageReply])],
  providers: [
    FindImageReplyWithUserHelperRepository,
    FindImageRepliesWithUserByImageHelperRepository,
  ],
  exports: [
    FindImageReplyWithUserHelperRepository,
    FindImageRepliesWithUserByImageHelperRepository,
  ],
})
export class ImageReplyHelperModule {}
