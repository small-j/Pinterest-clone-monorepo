import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveImage } from './entities/save-image.entity';
import { User } from 'src/user/entities/user.entity';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class SaveImageRepository {
  constructor(
    @InjectRepository(SaveImage)
    private readonly saveImageRepository: Repository<SaveImage>,
  ) {}

  async addSaveImage(saveImage: SaveImage): Promise<void> {
    await this.saveImageRepository.save(saveImage);
  }

  async findById(id: number): Promise<SaveImage> {
    return this.saveImageRepository.findOneBy({ id: id });
  }

  async findByUserIdAndImageId(user: User, image: Image): Promise<SaveImage> {
    return this.saveImageRepository.findOne({ where: { user, image } });
  }

  async deleteSaveImage(id: number): Promise<void> {
    await this.saveImageRepository.delete(id);
  }

  async deleteSaveImageToImage(image: Image): Promise<void> {
    await this.saveImageRepository.delete({ image });
  }

  async findByImage(image: Image): Promise<SaveImage[]> {
    return this.saveImageRepository.find({ where: { image } });
  }

  async findByUser(user: User): Promise<SaveImage[]> {
    return this.saveImageRepository.find({ where: { user } });
  }
}
