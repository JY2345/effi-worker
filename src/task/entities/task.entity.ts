import { User } from '../../user/entities/user.entity';
import { ColumnEntity } from '../../column/entities/column.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { TaskUser } from './taskUser.entity';
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
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
@Entity('task')
export class Task {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @IsNotEmpty({ message: '칼럼 ID를 입력해주세요.' })
  @Column({ type: 'int', unsigned: true, name: 'columnId', nullable: false })
  columnId: number;

  @Column({ type: 'int', unsigned: true, name: 'userId', nullable: false })
  userId: number;

  @IsString()
  @IsNotEmpty({ message: '이름이 없습니다.' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '설명이 없습니다.' })
  @Column({ type: 'text' })
  info: string;

  @IsString()
  @IsNotEmpty({ message: '색상이 없습니다.' })
  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl: string;

  @IsString()
  @IsNotEmpty({ message: '만기일을 입력해주세요' })
  @Column({ type: 'datetime', nullable: false })
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

  @OneToMany(() => TaskUser, (taskUser) => taskUser.user)
  taskUser: TaskUser[];

  @JoinColumn({ name: 'columnId' })
  column: ColumnEntity;
  @ManyToOne(() => User, (user) => user.task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
