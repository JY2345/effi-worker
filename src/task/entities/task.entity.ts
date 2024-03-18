import { ColumnEntity } from 'src/column/entities/column.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('task')
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

  @Column({ type: 'datetime' })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @ManyToOne(() => ColumnEntity, (column) => column.tasks, {
    onDelete: 'CASCADE',
  })
  column: ColumnEntity;

  @ManyToOne(() => User, (user) => user.task, { onDelete: 'CASCADE' })
  user: User;
}
