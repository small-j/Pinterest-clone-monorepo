import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtProviderModule } from 'src/common/jwt-provider.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtProviderModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
