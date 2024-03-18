import { ColumnEntity } from 'src/column/entities/column.entity';
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
import { Board } from './board.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'board',
})
export class BoardUser {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'int', unsigned: true, name: 'userId', nullable: false })
  userId: number;

  @Column({ type: 'bigint', name: 'boardId', nullable: false })
  boardId: bigint;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @OneToMany(() => ColumnEntity, (column) => column.board)
  columns: ColumnEntity[];

  @ManyToOne(() => Board, (board) => board.boardUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @ManyToOne(() => User, (user) => user.boardUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
