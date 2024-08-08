import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginInfoDto } from './dto/login-info.dto';
import { UserInfoeDto } from './dto/user-info.dto';
import { User } from './entities/user.entity';
import { JwtTokenInterceptor } from 'src/interceptor/jwt-token.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/join')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userRequest: CreateUserDto): Promise<number> {
    return this.userService.register(userRequest);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(JwtTokenInterceptor)
  async login(@Body() loginInfoRequest: LoginInfoDto): Promise<User> {
    return await this.userService.login(loginInfoRequest);
  }

  @Get()
  async getUserInfo(@Query('id') id: number): Promise<UserInfoeDto> {
    return this.userService.getUserInfo(id);
  }
}
