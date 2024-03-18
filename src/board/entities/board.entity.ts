import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'board',
})
export class Board {
  [x: string]: any;
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

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt?: Date;
  columns: any;
}
