import { Module } from '@nestjs/common';
import { ImageReplyService } from './image-reply.service';
import { ImageReplyController } from './image-reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageReply } from './entities/image-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageReply])],
  controllers: [ImageReplyController],
  providers: [ImageReplyService],
})
export class ImageReplyModule {}
