import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { JwtTokenHeaderFormDto } from './dto/jwt-token-header-form.dto';
import { ConfigService } from '@nestjs/config';

interface Payload {
  sub: string;
}

@Injectable()
export class JwtProviderService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  createJwtToken(user: User): string {
    const payload: Payload = { sub: user.email };

    return this.jwtService.sign(payload);
  }

  getJwtTokenHeaderForm(jwtToken: string): JwtTokenHeaderFormDto {
    return new JwtTokenHeaderFormDto(
      this.configService.get<string>('TOKEN_HEADER_STRING'),
      `${this.configService.get<string>('TOKEN_PREFIX')}${jwtToken}`,
    );
  }

  checkRequestTokenHeader(request: Request): boolean {
    const header =
      request.headers[
        this.configService.get<string>('TOKEN_HEADER_STRING').toLowerCase()
      ];
    return (
      header &&
      header.startsWith(this.configService.get<string>('TOKEN_PREFIX'))
    );
  }

  getTokenFromHttpHeader(request: Request): string {
    const header =
      request.headers[
        this.configService.get<string>('TOKEN_HEADER_STRING').toLowerCase()
      ];
    return header.replace(this.configService.get<string>('TOKEN_PREFIX'), '');
  }

  validateToken(token: string): Payload {
    return this.jwtService.verify<Payload>(token);
  }

  getEmailFromJwtToken(token: string): string {
    const payload = this.jwtService.decode<Payload>(token);
    return payload.sub;
  }
}
