import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Column, Repository } from 'typeorm';
import { ColumnEntity } from 'src/column/entities/column.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateTaskOrderDto } from '../column/dto/update-task-order.dto';
import { FindAllTaskDto } from './dto/findAll-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(ColumnEntity)
    private readonly columnEntityRepository: Repository<ColumnEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createTask(
    userId: number,
    { columnId, name, info, color, dueDate, fileUrl }: CreateTaskDto,
  ) {
    // const { columnId, name, info, color } = createTaskDto;

    // 컬럼 존재 확인
    const column = await this.columnEntityRepository.findOne({
      where: { id: columnId },
      relations: {
        board: true,
      },
    });
    if (!column) {
      throw new BadRequestException('컬럼이 존재하지 않습니다.');
    }


    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof dueDate !== 'string' || !pattern.test(dueDate)) {
      throw new BadRequestException(
        "날짜 형식이 유효하지 않습니다. 'YYYY-MM-DD' 형식으로 입력해주세요.",
      );
    }

    const newDueDate = new Date(dueDate);

    if (isNaN(newDueDate.getTime())) {
      throw new BadRequestException('유효한 날짜 형식이 아닙니다.');
    }

    // 카드 생성
    const task = await this.taskRepository.save({
      userId,
      columnId,
      name,
      info,
      color,
      dueDate,
      fileUrl,
    });

    return task;
  }

  async findAll(boardId: number): Promise<Task[]> {
    const columns = await this.columnEntityRepository.find({
      where: { boardId: boardId },
    });
    if (columns.length < 1) {
      throw new NotFoundException('해당 boardId에 해당하는 칼럼이 없습니다.');
    }

    const whereArr = columns.map((column) => {
      return { columnId: column.id };
    });

    const tasks = await this.taskRepository.find({
      where: whereArr,
    });

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('해당 columnId에 해당하는 카드가 없습니다.');
    }

    return tasks;
  }

  // 카드 상세조회
  async findOneTask(id: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('카드를 찾을 수 없습니다.');
    }
    return task;
  }

  // 카드 수정
  async updateTask(
    id: number,
    userId: number,
    { name, info, color, worker, dueDate, fileUrl }: UpdateTaskDto,
  ) {
    // const { name, info, color, worker } = updateTaskDto;

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('카드를 수정할 수 없습니다.');
    }

    // 작업자 할당 수정
    if (worker !== undefined && worker === task.worker) {
      if (Object.values(Worker).includes(worker)) {
        task.worker = worker;
      } else {
        throw new NotFoundException('작업자가 존재하지 않습니다.');
      }
    }

    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(dueDate.toISOString().slice(0, 10))) {
      throw new BadRequestException(
        "날짜 형식이 유효하지 않습니다. 'YYYY-MM-DD' 형식으로 입력해주세요.",
      );
    }

    const newDueDate = new Date(dueDate);

    if (isNaN(newDueDate.getTime())) {
      throw new BadRequestException('유효한 날짜 형식이 아닙니다.');
    }

    await this.taskRepository.update(id, {
      name,
      info,
      color,
      worker: task.worker,
      dueDate,
      fileUrl,
    });

    return this.taskRepository.findOneBy({ id });
  }

  // 카드 삭제
  async removeTask(id: number, userId: number) {
    // task 확인
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new BadRequestException('카드가 없습니다.');
    }

    // userId 확인 >>
    if (task.userId !== userId) {
      throw new BadRequestException('삭제할 권한이 없습니다.');
    }

    await this.taskRepository.delete({ id });
  }

}
