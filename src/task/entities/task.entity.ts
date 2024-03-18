import { User } from 'src/user/entities/user.entity';
import { ColumnEntity } from 'src/column/entities/column.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('task')
export class Task {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @Column({ type: 'int', name: 'columnId', nullable: false })
  columnId: number;

  @Column({ type: 'int', name: 'userId', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text' })
  info: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl: string;

  @Column({ type: 'bigint', nullable: false })
  order: number;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @ManyToOne(() => ColumnEntity, (column) => column.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'columnId' })
  column: ColumnEntity;

  @ManyToOne(() => User, (user) => user.task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
