import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { Task } from '../../task/entities/task.entity';
@Entity('board_column')
export class ColumnEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'bigint', nullable: false })
  boardId: number;
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;
  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;
  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.column, {
    cascade: true,
  })
  tasks: Task[];

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
  board: Board;
}
