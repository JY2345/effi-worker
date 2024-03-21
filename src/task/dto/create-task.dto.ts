import { PickType } from '@nestjs/mapped-types';
import { Task } from '../entities/task.entity';

export class CreateTaskDto extends PickType(Task, [
  'columnId',
  'name',
  'info',
  'color',
  'dueDate',
]) {}
