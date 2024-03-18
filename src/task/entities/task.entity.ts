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

  @ManyToOne(() => Column, (column) => column.tasks, { onDelete: 'CASCADE' })
  column: Column;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;
}
