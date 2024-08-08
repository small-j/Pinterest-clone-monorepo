import { Category } from '../entities/category.entity';

export class GetCategoryDto {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static of(entity: Category): GetCategoryDto {
    return new GetCategoryDto(entity.id, entity.name);
  }
}
