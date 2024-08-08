import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { authGuardIgnorePath } from 'src/common/auth-guard-ignore-path';
import { JwtProviderService } from 'src/common/jwt-provider.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtProviderService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') return false;

    const request = context.switchToHttp().getRequest();

    if (this.isAuthIgnorePath(request)) return true;

    if (!this.jwtService.checkRequestTokenHeader(request)) return false;
    const token = this.jwtService.getTokenFromHttpHeader(request);

    if (token && this.jwtService.validateToken(token)) {
      const email = this.jwtService.getEmailFromJwtToken(token);
      request.email = email;
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
