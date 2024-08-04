import { BaseTime } from 'src/common/entities/base-time';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @Column()
  name: string;

  @Column(() => BaseTime)
  baseTime: BaseTime;

  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }
}
