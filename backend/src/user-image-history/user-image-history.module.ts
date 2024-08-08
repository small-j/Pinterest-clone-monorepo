import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserImageHistory } from './entities/user-image-history.entity';
import { UserImageHistoryRepository } from './user-image-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserImageHistory])],
  providers: [UserImageHistoryRepository],
  exports: [UserImageHistoryRepository],
})
export class UserImageHistoryModule {}
