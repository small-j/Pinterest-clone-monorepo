import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { JwtTokenHeaderFormDto } from 'src/common/dto/jwt-token-header-form.dto';
import { JwtProviderService } from 'src/common/jwt-provider.service';
import { UsereDto } from 'src/user/dto/user.dto';

@Injectable()
export class JwtTokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtProvider: JwtProviderService) {}

  intercept(
    context: ExecutionContext,
    call$: CallHandler<UsereDto>,
  ): Observable<any> {
    return call$.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.jwtProvider.createJwtToken(user);
        const { headerName, jwtToken }: JwtTokenHeaderFormDto =
          this.jwtProvider.getJwtTokenHeaderForm(token);

        response.setHeader(headerName, jwtToken);
        return user;
      }),
    );
  }
}
