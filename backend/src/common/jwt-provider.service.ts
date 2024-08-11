import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { JwtTokenHeaderFormDto } from './dto/jwt-token-header-form.dto';
import { ConfigService } from '@nestjs/config';
import { FindUserByImageHelperRepository } from 'src/user-helper/user-helper.repository';
import { InjectRepository } from '@nestjs/typeorm';

interface Payload {
  sub: string;
}

@Injectable()
export class JwtProviderService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(FindUserByImageHelperRepository)
    private readonly userRepository: FindUserByImageHelperRepository,
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
    try {
      return this.jwtService.verify<Payload>(token);
      // } catch (err: TokenExpiredError) {
      // TODO: 특정 에러 잡는걸로 바꾸기.
    } catch (err: any) {
      throw new UnauthorizedException();
    }
  }

  getEmailFromJwtToken(token: string): string {
    const payload = this.jwtService.decode<Payload>(token);
    return payload.sub;
  }

  async getUserFromEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }
}
