import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { authGuardIgnorePath } from 'src/common/auth/auth-guard-ignore-path';
import { JwtProviderService } from 'src/common/jwt-provider.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtProviderService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') return false;

    const request = context.switchToHttp().getRequest();

    if (this.isAuthIgnorePath(request)) return true;

    if (!this.jwtService.checkRequestTokenHeader(request)) return false;
    const token = this.jwtService.getTokenFromHttpHeader(request);

    if (token && this.jwtService.validateToken(token)) {
      const email = this.jwtService.getEmailFromJwtToken(token);
      const user = await this.jwtService.getUserFromEmail(email);
      console.log(user);

      if (!user) throw new ForbiddenException();
      request.user = user;
      return true;
    }

    return false;
  }

  private isAuthIgnorePath(request: Request): boolean {
    return (
      typeof authGuardIgnorePath.find(
        (path) => path === this.parsePathFromUrl(request.url),
      ) !== 'undefined'
    );
  }

  private parsePathFromUrl(url: string): string {
    return url.substring(url.indexOf('/'));
  }
}
