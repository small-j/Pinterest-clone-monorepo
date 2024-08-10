import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { ImageModule } from './image/image.module';
import { CategoryModule } from './category/category.module';
import { ImageCategoryModule } from './image-category/image-category.module';
import { UserImageHistoryModule } from './user-image-history/user-image-history.module';
import { ImageReplyModule } from './image-reply/image-reply.module';
import { SaveImageModule } from './save-image/save-image.module';
import { UserModule } from './user/user.module';
import { JwtProviderModule } from './common/jwt-provider.module';
import { StorageModule } from './storage/storage.module';
import { RolesGuard } from './guard/roles-guard';
import { RoleModule } from './common/auth/role.module';
import { SaveImageHelperModule } from './save-image-helper/save-image-helper.module';
import { ImageReplyHelperModule } from './image-reply-helper/image-reply-helper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    StorageModule,
    JwtProviderModule,
    RoleModule,
    UserModule,
    ImageModule,
    CategoryModule,
    ImageCategoryModule,
    UserImageHistoryModule,
    ImageReplyModule,
    SaveImageModule,
    SaveImageHelperModule,
    ImageReplyHelperModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
