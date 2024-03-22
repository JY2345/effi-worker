import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { ColumnEntity } from './entities/column.entity';
import { Board } from '../board/entities/board.entity';
import { Task } from '../task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity, Board, Task])],
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [TypeOrmModule],
})
export class ColumnModule {}
