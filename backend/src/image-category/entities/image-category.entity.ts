import { BaseTime } from 'src/common/entities/base-time';
import { Image } from 'src/image/entities/image.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ImageCategory {
  @PrimaryGeneratedColumn({ name: 'image_category_id' })
  id: number;

  @ManyToOne(() => Image, (image) => image.imageCategories, { lazy: true })
  @JoinColumn({ name: 'image_meta_id' })
  image: Image;

  @Column()
  categoryId: number;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  constructor(image?: Image, categoryId?: number) {
    if (image) {
      this.image = image;
    }
    if (categoryId) {
      this.categoryId = categoryId;
    }
  }

  static create(image: Image, categoryId: number): ImageCategory {
    const imageCategory = new ImageCategory();
    imageCategory.categoryId = categoryId;
    imageCategory.image = image;
    image.addCategory(imageCategory);
    return imageCategory;
  }
}
