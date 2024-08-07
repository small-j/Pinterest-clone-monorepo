import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginInfoDto } from './dto/login-info.dto';
import { UserInfoeDto } from './dto/user-info.dto';
import { ErrorMessage } from 'src/common/enum/error-message';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async register(userRequest: CreateUserDto): Promise<number> {
    const user = new User(
      userRequest.email,
      userRequest.name,
      userRequest.password,
      'USER',
    );
    await user.hashPassword();

    try {
      await this.userRepository.save(user);
      return user.id;
    } catch (error) {
      throw new BadRequestException(ErrorMessage.DUPLICATE_USER);
    }
  }

  async login(loginInfoRequest: LoginInfoDto): Promise<User> {
    const user = await this.findUserByEmail(loginInfoRequest.email);
    this.validateUser(user);
    await this.isEqualPassword(user, loginInfoRequest.password);

    return user;
  }

  async getUserInfo(id: number): Promise<UserInfoeDto> {
    const user = await this.userRepository.findOneBy({ id: id });
    this.validateUser(user);

    const saveImages = await user.saveImages;
    console.log(saveImages);
    const images =
      typeof saveImages === 'undefined'
        ? []
        : saveImages.map((saveImage) => saveImage.image); // TODO: n + 1 문제 개선.

    return UserInfoeDto.of(user, images);
  }

  private validateUser(user: User) {
    if (!user) throw new NotFoundException(ErrorMessage.NOT_EXIST_USER);
  }

  private async isEqualPassword(user: User, requestPassword: string) {
    const isMatch = await user.checkPassword(requestPassword);
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
