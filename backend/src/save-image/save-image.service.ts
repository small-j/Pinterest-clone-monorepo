import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SaveImage } from './entities/save-image.entity';
import { User } from 'src/user/entities/user.entity';
import { Image } from 'src/image/entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveImageRepository } from './save-image.repository';
import { ImageRepository } from 'src/image/image.repository';
import { ErrorMessage } from 'src/common/enum/error-message';
import { CreateSaveImageDto } from './dto/create-save-image.dto';
import { UserRepository } from 'src/user/user.repository';
import { GetSaveImageDto } from './dto/get-save-image.dto';
import { GetSaveImageIdDto } from './dto/get-save-image-id.dto';

@Injectable()
export class SaveImageService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(ImageRepository)
    private readonly imageRepository: ImageRepository,
    @InjectRepository(SaveImageRepository)
    private readonly saveImageRepository: SaveImageRepository,
  ) {}

  async addSaveImage(
    saveImageRequest: CreateSaveImageDto,
    user: User,
  ): Promise<GetSaveImageDto> {
    const image = await this.imageRepository.findOne({
      where: { id: saveImageRequest.imageMetaId },
    });

    this.validateUser(user);
    this.validateImage(image);

    const saveImage = SaveImage.createSaveImage(user, image);

    try {
      await this.saveImageRepository.save(saveImage);
    } catch (error) {
      throw new BadRequestException(ErrorMessage.DUPLICATE_SAVE_IMAGE);
    }

    return new GetSaveImageDto(saveImage.id, image.id, user.id);
  }

  async deleteSaveImage(id: number): Promise<GetSaveImageIdDto> {
    const saveImage = await this.saveImageRepository.findOneBy({ id });
    const response = new GetSaveImageIdDto(saveImage.id);
    this.validateSaveImage(saveImage);
    await this.saveImageRepository.remove(saveImage);
    return response;
  }

  async getSaveImage(imageId: number, user: User): Promise<GetSaveImageDto> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
    });
    this.validateUser(user);
    this.validateImage(image);

    const saveImage = await this.saveImageRepository.findByImageAndUser(
      image,
      user,
    );
    this.validateSaveImage(saveImage);

    return new GetSaveImageDto(saveImage.id, user.id, image.id);
  }

  private validateSaveImage(saveImage: SaveImage) {
    if (!saveImage) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_SAVE_IMAGE);
    }
  }

  private validateUser(user: User) {
    if (!user) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_USER);
    }
  }

  private validateImage(image: Image) {
    if (!image) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_IMAGE);
    }
  }
}
