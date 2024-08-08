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

  async addSaveImage(saveImageRequest: CreateSaveImageDto): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: saveImageRequest.userId },
    });
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

    return saveImage.id;
  }

  async deleteSaveImage(saveImageId: number): Promise<number> {
    const saveImage = await this.isExistSaveImage(saveImageId);
    await this.saveImageRepository.remove(saveImage);
    return saveImageId;
  }

  private async isExistSaveImage(saveImageId: number): Promise<SaveImage> {
    const saveImage = await this.saveImageRepository.findOne({
      where: {
        id: saveImageId,
      },
    });
    this.validateSaveImage(saveImage);
    return saveImage;
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
