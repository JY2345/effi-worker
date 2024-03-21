import { PickType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class UpdateTaskOrderDto extends PickType(Task, ['order']) {}
