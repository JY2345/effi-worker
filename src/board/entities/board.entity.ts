import { ColumnEntity } from 'src/column/entities/column.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardUser } from './boardUser.entity';

@Entity({
  name: 'board',
})
export class Board {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'text', nullable: false })
  info: string;

  @Column({ type: 'text', nullable: false })
  columnOrder: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @OneToMany(() => ColumnEntity, (column) => column.board)
  columns: ColumnEntity[];

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
  boardUser: BoardUser[];
}
