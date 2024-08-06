import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtProviderService } from './jwt-provider.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('EXPIRATION_TIME'),
          algorithm: 'HS384',
        },
        verifyOptions: {
          algorithms: ['HS384'],
        },
      }),
    }),
  ],
  providers: [JwtProviderService],
  exports: [JwtProviderService],
})
export class JwtProviderModule {}