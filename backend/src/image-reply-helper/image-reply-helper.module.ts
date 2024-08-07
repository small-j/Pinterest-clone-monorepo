import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';
import { GetImageRepliesFromUserHelperRepository } from './image-reply-helper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImageReply])],
  providers: [GetImageRepliesFromUserHelperRepository],
  exports: [GetImageRepliesFromUserHelperRepository],
})
export class ImageReplyHelperModule {}
