import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'taskUser',
})
export class TaskUser {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'int', unsigned: true, name: 'userId', nullable: false })
  userId: number;

  @Column({ type: 'bigint', name: 'boardId', nullable: false })
  taskId: bigint;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @ManyToOne(() => Task, (task) => task.taskUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @ManyToOne(() => User, (user) => user.taskUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
