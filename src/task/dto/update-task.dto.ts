import { PickType } from '@nestjs/mapped-types';

import { Task } from '../entities/task.entity';
import { IsNumber } from 'class-validator';

export class UpdateTaskDto extends PickType(Task, [
  'name',
  'info',
  'color',
  'dueDate',
  'fileUrl',
]) {}

export class ChgTaskColDto {
  @IsNumber({}, { each: true, message: '컬럼 ID를 숫자 형식으로 입력하세요.' })
  columnId: number;
  @IsNumber({}, { each: true, message: '카드 ID를 숫자 형식으로 입력하세요.' })
  taskId: number;
}
