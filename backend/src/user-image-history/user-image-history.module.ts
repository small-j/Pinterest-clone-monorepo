import { Module } from '@nestjs/common';
import { UserImageHistoryService } from './user-image-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserImageHistory } from './entities/user-image-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserImageHistory])],
  providers: [UserImageHistoryService],
})
export class UserImageHistoryModule {}
