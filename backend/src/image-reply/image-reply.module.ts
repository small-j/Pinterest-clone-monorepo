import { Module } from '@nestjs/common';
import { ImageReplyService } from './image-reply.service';
import { ImageReplyController } from './image-reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageReply } from './entities/image-reply.entity';
import { UserModule } from 'src/user/user.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageReply]), UserModule, ImageModule],
  controllers: [ImageReplyController],
  providers: [ImageReplyService],
})
export class ImageReplyModule {}
