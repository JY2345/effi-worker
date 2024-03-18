import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true })
  columnId: number;

  @Column({ unsigned: true })
  userId: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  info: Date;

  @Column()
  color: string;

  @Column()
  fileUrl: string;

  @Column()
  order: number;

  @Column({ type: 'time' })
  dueDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
