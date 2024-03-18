import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'board',
})
export class BoardUser {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'bigint', nullable: false })
  userId: bigint;

  @Column({ type: 'bigint', nullable: false })
  boardId: bigint;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt?: Date;
}
