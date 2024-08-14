import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtProviderModule } from 'src/common/jwt-provider.module';
import { UserRepository } from './user.repository';
import { SaveImageHelperModule } from 'src/save-image-helper/save-image-helper.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtProviderModule,
    SaveImageHelperModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
