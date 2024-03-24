import { PickType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class FindAllTaskDto extends PickType(Task, ['columnId']) {}
