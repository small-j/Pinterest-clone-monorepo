import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ImageCategory } from './entities/image-category.entity';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class ImageCategoryRepository extends Repository<ImageCategory> {
  async addImageCategory(imageCategory: ImageCategory): Promise<void> {
    await this.save(imageCategory);
  }

  async findByImage(image: Image): Promise<ImageCategory[]> {
    return this.find({ where: { image } });
  }

  async getCategoryFromSearchWord(searchStr: string): Promise<ImageCategory[]> {
    return this.createQueryBuilder('ic')
      .innerJoinAndSelect('ic.category', 'c')
      .where('c.name LIKE :searchStr', { searchStr: `%${searchStr}%` })
      .getMany();
  }
}
