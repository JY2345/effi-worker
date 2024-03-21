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
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';
import { MoveTaskDto } from './dto/move-task.dto';
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
    { columnId, name, info, color, dueDate }: CreateTaskDto,
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
    if (!pattern.test(dueDate)) {
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
    });

    return task;
  }

  // 카드 전체조회
  // async findAll({ columnId }: FindAllTaskDto) {
  //   const tasks = await this.taskRepository.find({
  //     where: { columnId },
  //   });
  //   if (!tasks) {
  //     throw new NotFoundException('카드를 찾을 수 없습니다.');
  //   }

  //   return tasks;
  // }

  // async findAll(): Promise<Task[]> {
  //   return await this.taskRepository.find();
  // }

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
    console.log(whereArr);

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
    { name, info, color, worker, dueDate }: UpdateTaskDto,
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
    if (!pattern.test(dueDate)) {
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
  async updateTaskOrder(
    taskId: number,
    userId: number,
    { newColumnId, newOrder }: MoveTaskDto,
  ) {
    // 사용자 확인
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 이동할 새로운 컬럼과 현재 컬럼 확인
    const newColumn = await this.columnEntityRepository.findOneBy({
      id: newColumnId,
    });
    if (!newColumn)
      throw new NotFoundException('새로운 컬럼이 존재하지 않습니다.');

    const task = await this.taskRepository.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException('카드가 존재하지 않습니다.');

    if (task.columnId !== newColumnId) {
      // 다른 컬럼으로 이동하는 경우
      task.columnId = newColumnId;
    }

    // 현재 컬럼 내에서의 순서 변경인 경우
    if (task.columnId === newColumnId) {
      const tasksInColumn = await this.taskRepository.find({
        where: { columnId: newColumnId },
        order: { order: 'ASC' }, // 컬럼 내 카드들을 순서대로 정렬
      });

      // 새로운 순서가 범위를 벗어난 경우 예외처리
      if (newOrder >= tasksInColumn.length || newOrder < 0) {
        throw new BadRequestException('유효하지 않은 순서입니다.');
      }

      // 순서 변경 로직
      const currentIndex = tasksInColumn.findIndex((t) => t.id === task.id);
      tasksInColumn.splice(currentIndex, 1); // 현재 카드를 배열에서 제거
      tasksInColumn.splice(newOrder, 0, task); // 새로운 위치에 현재 카드를 삽입

      // 각 카드의 순서를 업데이트
      for (let i = 0; i < tasksInColumn.length; i++) {
        tasksInColumn[i].order = i;
        await this.taskRepository.save(tasksInColumn[i]);
      }
    }

    return task;
  }
}
