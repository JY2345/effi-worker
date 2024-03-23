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
import { TaskUser } from './entities/taskUser.entity';
import { UpdateTaskOrderDto } from '../column/dto/update-task-order.dto';
import { FindAllTaskDto } from './dto/findAll-task.dto';
import { AddWorkerTaskDto } from './dto/add-worker-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(ColumnEntity)
    private readonly columnEntityRepository: Repository<ColumnEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(TaskUser) private readonly taskUserRepository: Repository<TaskUser>,
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

  async findAll(columnId: number): Promise<Task[]> {
    const existingColumn = await this.columnEntityRepository.findOne({
      where: { id: columnId },
    });
    if (!existingColumn) {
      throw new NotFoundException('해당하는 컬럼이 없습니다.');
    }

    if (existingColumn.taskOrder && existingColumn.taskOrder.length > 0) {
      const taskOrderArray = JSON.parse(existingColumn.taskOrder);
      const orderedQuery = this.taskRepository
        .createQueryBuilder('task')
        .where('task.columnId = :columnId', { columnId })
        .orderBy(`FIELD(task.id, ${taskOrderArray.join(',')})`);
      return await orderedQuery.getMany();
    } else {
      const defaultQuery = this.taskRepository
        .createQueryBuilder('task')
        .where('task.columnId = :columnId', { columnId })
        .orderBy('task.id', 'ASC');

      return await defaultQuery.getMany();
    }
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
    { name, info, color, dueDate, fileUrl }: UpdateTaskDto,
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

    await this.taskRepository.update(id, {
      name,
      info,
      color,
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

  // task 작업자 추가
  async addWorker(addWorkerTaskDto: AddWorkerTaskDto) {
    const { workerId, taskId } = addWorkerTaskDto;

    const existingTask = await this.taskRepository.findOneBy({ id: taskId });
    if (!existingTask) {
      throw new NotFoundException('해당 카드 정보를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOneBy({ id: workerId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const existingWorker = await this.taskUserRepository.findOneBy({ userId: workerId, taskId : BigInt(taskId) });
    if (existingWorker) {
      throw new BadRequestException('이미 존재하는 작업자입니다.');
    }

    const taskUser = await this.taskUserRepository.save({
      userId : +workerId,
      taskId : BigInt(taskId)
    })

    return taskUser;
  }

  async removeWorker(addWorkerTaskDto: AddWorkerTaskDto) {
    const {workerId, taskId} = addWorkerTaskDto;
    const taskUser = await this.taskUserRepository.findOneBy({ userId : workerId, taskId: BigInt(taskId) });
    if (!taskUser) {
      throw new NotFoundException('해당 카드에 대한 담당자를 찾을 수 없습니다.');
    }

    // 담당자 삭제
    await this.taskUserRepository.remove(taskUser);
  }

  async getWorkers(taskId: number) {
    return this.taskUserRepository.find({
      where: { taskId : BigInt(taskId) },
    });
  }
}
