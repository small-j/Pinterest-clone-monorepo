import { Category } from 'src/category/entities/category.entity';
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

  @ManyToOne(() => Category, { lazy: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  constructor(image?: Image, category?: Category) {
    if (image) {
      this.image = image;
    }
    if (category) {
      this.category = category;
    }
  }

  static create(image: Image, category: Category): ImageCategory {
    const imageCategory = new ImageCategory();
    imageCategory.category = category;
    imageCategory.image = image;
    image.addCategory(imageCategory);
    return imageCategory;
  }
}
