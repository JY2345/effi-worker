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
  task: Task;

  @Column({ type: 'int', name: 'taskId', select: true, nullable: false })
  taskId: number;

  @ManyToOne(() => User, (user) => user.comment)
  user: User;

  @Column({ type: 'int', name: 'userId', select: true, nullable: false })
  userId: number;
}
