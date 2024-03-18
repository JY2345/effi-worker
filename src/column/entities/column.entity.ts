import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Columns')
export class BoardColumn extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { name: 'boardId' })
  boardId: number;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @CreateDateColumn({ type: 'bigint', name: 'createdAt' })
  createdAt: number;

  @UpdateDateColumn({ type: 'bigint', name: 'updatedAt' })
  updatedAt: number;
}
