import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Board } from '../../board/entities/board.entity';
import { BoardUser } from '../../board/entities/boardUser.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Task } from '../../task/entities/task.entity';
import { TaskUser } from '../../task/entities/taskUser.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BoardUser, (boardUser) => boardUser.user)
  boardUser: BoardUser[];

  @OneToMany(() => TaskUser, (taskUser) => taskUser.user)
  taskUser: TaskUser[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Task, (task) => task.user)
  task: Task[];

  @OneToMany(() => Board, (board) => board.user)
  board: Board[];
}
