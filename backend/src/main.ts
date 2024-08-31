import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guard/auth-guard';
import { JwtProviderService } from './common/jwt-provider.service';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(
      '/etc/letsencrypt/live/www.common-main-server.kr/privkey.pem',
    ),
    cert: fs.readFileSync(
      '/etc/letsencrypt/live/www.common-main-server.kr/fullchain.pem',
    ),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  const jwtProviderService = app.get(JwtProviderService);
  app.useGlobalGuards(new AuthGuard(jwtProviderService));

  await app.listen(3000);
}
bootstrap();
