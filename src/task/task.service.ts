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
    { columnId, name, info, color }: CreateTaskDto,
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

    // 카드 생성
    const task = await this.taskRepository.save({
      userId,
      columnId,
      name,
      info,
      color,
    });

    return task;
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  // 카드 수정
  async updateTask(
    id: number,
    userId: number,
    { name, info, color, worker }: UpdateTaskDto,
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

    await this.taskRepository.update(id, {
      name,
      info,
      color,
      worker: task.worker,
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

  // 카드 이동
  // class Node<T> {
  //   public next : Node<T> | null = null
  //   public prev : Node<T> | null = null
  //   constructor(public data : T) {}
  // }
}
