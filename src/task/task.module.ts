import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { ColumnEntity } from 'src/column/entities/column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, ColumnEntity, Comment])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
