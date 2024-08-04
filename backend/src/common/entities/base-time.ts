import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseTime {
  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedDate: Date;
}
