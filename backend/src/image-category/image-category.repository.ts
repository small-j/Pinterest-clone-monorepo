import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageCategory } from './entities/image-category.entity';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class ImageCategoryRepository {
  constructor(
    @InjectRepository(ImageCategory)
    private readonly repository: Repository<ImageCategory>,
  ) {}

  async addImageCategory(imageCategory: ImageCategory): Promise<void> {
    await this.repository.save(imageCategory);
  }

  async findByImage(image: Image): Promise<ImageCategory[]> {
    return this.repository.find({ where: { image } });
  }

  async getCategoryFromSearchWord(searchStr: string): Promise<ImageCategory[]> {
    return this.repository
      .createQueryBuilder('ic')
      .innerJoinAndSelect('ic.category', 'c')
      .where('c.name LIKE :searchStr', { searchStr: `%${searchStr}%` })
      .getMany();
  }
}
