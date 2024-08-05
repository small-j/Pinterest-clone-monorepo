import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveImageRepository } from 'src/save-image/save-image.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginInfoDto } from './dto/login-info.dto';
import { UserInfoeDto } from './dto/user-info.dto';
import { JwtProvider } from './jwt/jwt-provider';
import { JwtTokenHeaderFormDto } from './jwt/dto/jwt-token-header-form.dto';
import { ErrorMessage } from './enums/error-message.enum';
import { BcryptService } from './bcrypt/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SaveImageRepository)
    private readonly saveImageRepository: SaveImageRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async register(userRequest: CreateUserDto): Promise<number> {
    const user = new User();
    user.email = userRequest.email;
    user.name = userRequest.name;
    user.password = await this.bcryptService.hash(userRequest.password);
    user.roles = 'USER'; // TODO: enum 타입으로 리팩토링

    try {
      await this.userRepository.save(user);
      return user.id;
    } catch (error) {
      throw new BadRequestException(ErrorMessage.DUPLICATE_USER);
    }
  }

  async login(loginInfoRequest: LoginInfoDto): Promise<JwtTokenHeaderFormDto> {
    const user = await this.findUserByEmail(loginInfoRequest.email);
    this.validateUser(user);
    await this.isEqualPassword(loginInfoRequest.password, user.password);

    const jwtToken = this.jwtProvider.createJwtToken(user);
    return this.jwtProvider.getJwtTokenHeaderForm(jwtToken);
  }

  async getUserInfo(id: number): Promise<UserInfoeDto> {
    const user = await this.userRepository.findOneBy({ id: id });
    this.validateUser(user);

    const saveImages = await this.saveImageRepository.findByUser(user);
    const images = saveImages.map((saveImage) => saveImage.image);

    return UserInfoeDto.of(user, images);
  }

  private validateUser(user: User) {
    if (!user) throw new NotFoundException(ErrorMessage.NOT_EXIST_USER);
  }

  private async isEqualPassword(requestPassword: string, dbPassword: string) {
    const isMatch = await this.bcryptService.compare(
      requestPassword,
      dbPassword,
    );
    if (!isMatch)
      throw new UnauthorizedException(ErrorMessage.MISMATCHED_PASSWORD);
  }

  private async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_USER);
    }
  }
}
