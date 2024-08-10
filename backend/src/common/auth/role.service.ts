import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ErrorMessage } from '../enum/error-message';
import { SaveImage } from 'src/save-image/entities/save-image.entity';
import { Role } from 'src/common/enum/role';
import { InjectRepository } from '@nestjs/typeorm';
import { FindSaveImageWithUserHelperRepository } from 'src/save-image-helper/save-image-helper.repository';
import { ImageReply } from 'src/image-reply/entities/image-reply.entity';
import { FindImageReplyWithUserHelperRepository } from 'src/image-reply-helper/image-reply-helper.repository';
import { FindImageWithUserHelperRepository } from 'src/image-helper/image-helper.repository';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(FindSaveImageWithUserHelperRepository)
    private readonly saveImageRepository: FindSaveImageWithUserHelperRepository,
    @InjectRepository(FindImageWithUserHelperRepository)
    private readonly imageRepository: FindImageWithUserHelperRepository,
    @InjectRepository(FindImageReplyWithUserHelperRepository)
    private readonly imageReplyRepository: FindImageReplyWithUserHelperRepository,
  ) {}

  async validate(className: string, email: string, id: number) {
    let user: User | null = null;

    if (className.includes('SaveImage'))
      user = await this.getUserFromSaveImage(id);
    else if (className.includes('ImageReply'))
      user = await this.getUserFromImageReply(id);
    else if (className.includes('Image'))
      user = await this.getUserFromImage(id);

    if (
      user &&
      (user.email === email || user.getRoleList().includes(Role.Admin))
    )
      return true;
    else return false;
  }

  private async getUserFromSaveImage(id: number) {
    const saveImage = await this.saveImageRepository.findOneWithUser(id);
    this.validateSaveImage(saveImage);
    this.validateUser(saveImage.user);

    return await saveImage.user;
  }

  private async getUserFromImageReply(id: number) {
    const imageReply = await this.imageReplyRepository.findOneWithUser(id);
    this.validateImageReply(imageReply);
    this.validateUser(imageReply.user);

    return await imageReply.user;
  }

  private async getUserFromImage(id: number) {
    const image = await this.imageRepository.findOneWithUser(id);
    this.validateImage(image);
    this.validateUser(image.user);

    return await image.user;
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

  private validateImageReply(imageReply: ImageReply) {
    if (!imageReply) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_IMAGE);
    }
  }
}
