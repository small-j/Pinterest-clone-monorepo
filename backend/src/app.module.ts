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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    ImageModule,
    CategoryModule,
    ImageCategoryModule,
    UserImageHistoryModule,
    ImageReplyModule,
    SaveImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
