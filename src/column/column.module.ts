import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { ColumnEntity } from './entities/column.entity';
import { Board } from '../board/entities/board.entity';
import { Task } from '../task/entities/task.entity';
import { User } from '../user/entities/user.entity';
import { BoardUser } from '../board/entities/boardUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity, Board, BoardUser, Task, User])],
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [TypeOrmModule],
})
export class ColumnModule {}
