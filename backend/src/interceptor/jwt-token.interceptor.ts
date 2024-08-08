import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from 'src/user/entities/user.entity';
import { JwtTokenHeaderFormDto } from 'src/common/dto/jwt-token-header-form.dto';
import { JwtProviderService } from 'src/common/jwt-provider.service';

@Injectable()
export class JwtTokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtProvider: JwtProviderService) {}

  intercept(
    context: ExecutionContext,
    call$: CallHandler<User>,
  ): Observable<string> {
    return call$.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.jwtProvider.createJwtToken(user);
        const { headerName, jwtToken }: JwtTokenHeaderFormDto =
          this.jwtProvider.getJwtTokenHeaderForm(token);

        response.setHeader(headerName, jwtToken);
        return 'login success';
      }),
    );
  }
}
