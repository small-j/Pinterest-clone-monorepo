import { Module } from '@nestjs/common';
import { ImageReplyService } from './image-reply.service';
import { ImageReplyController } from './image-reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageReply } from './entities/image-reply.entity';
import { UserModule } from 'src/user/user.module';
import { ImageModule } from 'src/image/image.module';
import { RoleModule } from 'src/common/auth/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageReply]),
    UserModule,
    ImageModule,
    RoleModule,
  ],
  controllers: [ImageReplyController],
  providers: [ImageReplyService],
})
export class ImageReplyModule {}
