import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guard/auth-guard';
import { JwtProviderService } from './common/jwt-provider.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const jwtProviderService = app.get(JwtProviderService);
  app.useGlobalGuards(new AuthGuard(jwtProviderService));

  await app.listen(3000);
}
bootstrap();
