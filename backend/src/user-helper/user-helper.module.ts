import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindUserByImageHelperRepository } from './user-helper.repository';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [FindUserByImageHelperRepository],
  exports: [FindUserByImageHelperRepository],
})
export class UserHelperModule {}
