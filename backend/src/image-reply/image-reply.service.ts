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

  async addReply(imageReplyRequest: CreateImageReplyDto): Promise<number> {
    const user = await this.userRepository.findOneBy({
      id: imageReplyRequest.userId,
    });
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
    return imageReply.id;
  }

  async deleteReply(id: number): Promise<number> {
    const imageReply = await this.imageReplyRepository.findOneBy({ id: id });
    this.isExistReply(imageReply);

    await this.imageReplyRepository.remove(imageReply);
    return id;
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
