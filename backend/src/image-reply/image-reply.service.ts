import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ImageReply } from './entities/image-reply.entity';
import { User } from 'src/user/entities/user.entity';
import { Image } from 'src/image/entities/image.entity';
import { ErrorMessage } from 'src/common/enum/error-message';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { ImageRepository } from 'src/image/image.repository';
import { CreateImageReplyDto } from './dto/create-image-reply.dto';
import { GetImageReplyDto } from './dto/get-image-reply.dto';

@Injectable()
export class ImageReplyService {
  constructor(
    @InjectRepository(ImageReply)
    private readonly imageReplyRepository: Repository<ImageReply>,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(ImageRepository)
    private readonly imageRepository: ImageRepository,
  ) {}

  async addReply(
    user: User,
    imageReplyRequest: CreateImageReplyDto,
  ): Promise<GetImageReplyDto> {
    const image = await this.imageRepository.findOneBy({
      id: imageReplyRequest.imageMetaId,
    });

    this.validateUser(user);
    this.validateImage(image);

    const imageReply = new ImageReply();
    imageReply.content = imageReplyRequest.content;
    imageReply.image = image;
    imageReply.user = user;

    await this.imageReplyRepository.save(imageReply);
    return GetImageReplyDto.of(imageReply, user);
  }

  async deleteReply(id: number, user: User): Promise<GetImageReplyDto> {
    const imageReply = await this.imageReplyRepository.findOneBy({ id: id });
    this.isExistReply(imageReply);

    const reply = GetImageReplyDto.of(imageReply, user);
    await this.imageReplyRepository.remove(imageReply);
    return reply;
  }

  private isExistReply(imageReply: ImageReply) {
    if (!imageReply) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_REPLY);
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
