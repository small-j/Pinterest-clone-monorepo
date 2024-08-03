import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @Column()
  name: string;

  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }
}
