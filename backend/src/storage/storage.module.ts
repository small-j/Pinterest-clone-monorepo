import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { AWSS3StorageService } from './aws-s3-storage.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'AWS_S3_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3({
          accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
          secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
          region: configService.get<string>('AWS_REGION'),
        });
      },
    },
    {
      provide: 'CustomStorageManager',
      useClass: AWSS3StorageService,
    },
  ],
  exports: [
    {
      provide: 'CustomStorageManager',
      useClass: AWSS3StorageService,
    },
  ],
})
export class StorageModule {}
