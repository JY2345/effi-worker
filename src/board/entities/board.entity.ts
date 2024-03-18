import { ColumnEntity } from 'src/column/entities/column.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardUser } from './boardUser.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'board',
})
export class Board {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'bigint', name: 'userId', nullable: false })
  userId: bigint;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'text', nullable: false })
  info: string;

  @Column({ type: 'text', nullable: false })
  columnOrder: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @OneToMany(() => ColumnEntity, (column) => column.board)
  columns: ColumnEntity[];

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
  boardUser: BoardUser[];

  @ManyToOne(() => User, (user) => user.board, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
