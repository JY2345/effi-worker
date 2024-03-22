import { PickType } from '@nestjs/mapped-types';

import { Task } from '../entities/task.entity';

export class UpdateTaskDto extends PickType(Task, [
  'name',
  'info',
  'color',
  'worker',
  'dueDate',
  'fileUrl',
]) {}
