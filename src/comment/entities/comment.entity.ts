import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'content' })
  content: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ type: 'int', unsigned: true, name: 'taskId', nullable: false })
  taskId: number;

  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', unsigned: true, name: 'userId', nullable: false })
  userId: number;
}
