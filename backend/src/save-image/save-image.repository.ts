import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SaveImage } from './entities/save-image.entity';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class SaveImageRepository extends Repository<SaveImage> {
  async deleteSaveImageToImage(image: Image): Promise<void> {
    await this.delete({ image });
  }

  async findByImage(image: Image): Promise<SaveImage[]> {
    return this.find({ where: { image } });
  }

  // TODO: 아래 삭제.
  // async findByUser(user: User): Promise<SaveImage[]> {
  //   return this.find({ where: { user: user } });
  // }

  // async findByUser(userId: number): Promise<SaveImage[]> {
  //   return this.createQueryBuilder('saveImage')
  //     .innerJoinAndSelect('saveImage.user', 'user')
  //     .where('user.id = :userId', { userId })
  //     .getMany();
  // }
}
