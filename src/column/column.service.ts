import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, Repository } from 'typeorm';
import { ColumnEntity } from './entities/column.entity';
import { Board } from '../board/entities/board.entity';
import { Task } from '../task/entities/task.entity';
import { BoardUser } from '../board/entities/boardUser.entity';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';
@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnEntity)
    private columnRepository: Repository<ColumnEntity>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(BoardUser)
    private boardUserRepository: Repository<BoardUser>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createColumn(createColumnDto: CreateColumnDto): Promise<ColumnEntity> {
    const boardId: bigint = BigInt(createColumnDto.boardId);
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }

    return this.columnRepository.save(createColumnDto);
  }

  async findColumnOrder(boardId: number): Promise<number[]> {
    const board = await this.boardRepository.findOneBy({ id: BigInt(boardId) });
    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }
    return JSON.parse(board.columnOrder);
  }

  async findAllColumnsInBoard(boardId: number): Promise<ColumnEntity[]> {
    const board = await this.boardRepository.findOneBy({ id: BigInt(boardId) });
    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }

    if (board.columnOrder && board.columnOrder.length > 0) {
      const columnOrderArray = JSON.parse(board.columnOrder);
      const orderedQuery = this.columnRepository
        .createQueryBuilder('column')
        .where('column.boardId = :boardId', { boardId })
        .orderBy(`FIELD(column.id, ${columnOrderArray.join(',')})`);

      return await orderedQuery.getMany();
    } else {
      const defaultQuery = this.columnRepository
        .createQueryBuilder('column')
        .where('column.boardId = :boardId', { boardId })
        .orderBy('column.id', 'ASC');

      return await defaultQuery.getMany();
    }
  }

  async findOne(id: number) {
    return this.columnRepository.findOne({
      where: { id: id },
    });
  }

  async updateColumnName(id: number, userId : number, updateColumnDto: UpdateColumnDto) {
    const existingColumn = await this.columnRepository.findOneBy({ id });

    if (!existingColumn) {
      throw new NotFoundException('존재하지 않는 컬럼입니다.');
    }
    const existingMember = await this.boardUserRepository.findOneBy({
      userId: userId,
      boardId: BigInt(existingColumn.boardId),
    });

    if (!existingMember) {
      throw new ForbiddenException('이 컬럼을 수정할 권한이 없습니다.');
    }

    existingColumn.name = updateColumnDto.name;

    await this.columnRepository.save(existingColumn);

    return {
      successMessage: '성공적으로 수정하였습니다.',
      successInfo: {
        id: existingColumn.id,
        name: existingColumn.name,
      },
    };
  }

  async removeColumn(id: number, userId : number) {
    const existingColumn = await this.columnRepository.findOne({
      where: { id: id },
      select: ['id', 'name', 'boardId'],
    });

    if (!existingColumn) {
      throw new NotFoundException('존재하지 않는 컬럼입니다.');
    }

    const boardId = existingColumn.boardId;

    const existingMember = await this.boardUserRepository.findOneBy({
      userId: userId,
      boardId: BigInt(boardId),
    });
    
    if (!existingMember) {
      throw new ForbiddenException('이 컬럼을 수정할 권한이 없습니다.');
    }

    await this.columnRepository.delete(id);

    return {
      successMessage: '성공적으로 삭제하였습니다.',
      successInfo: {
        id: existingColumn.id,
        name: existingColumn.name,
      },
    };
  }

  // TaskOrder 업데이트
  async updateTaskOrder(
    columnId: number,
    updateTaskOrderDto: UpdateTaskOrderDto,
  ): Promise<Board> {
    let column;
    try {
      column = await this.columnRepository.findOneBy({ id: columnId });
    } catch (error) {
      throw new BadRequestException('컬럼 ID가 유효한 숫자 형식이 아닙니다.');
    }

    if (!column) {
      throw new NotFoundException('존재하지 않는 컬럼입니다.');
    }

    let taskOrderArray: readonly any[] | FindOperator<any>;
    try {
      taskOrderArray = JSON.parse(updateTaskOrderDto.taskOrder);
    } catch (error) {
      throw new BadRequestException(
        '제공된 카드 순서가 유효한 JSON 형식이 아닙니다.',
      );
    }

    if (!Array.isArray(taskOrderArray)) {
      throw new BadRequestException('카드 순서는 배열이어야 합니다.');
    }

    let taskIds: any[];
    try {
      taskIds = await this.taskRepository.find({
        where: { id: In(taskOrderArray), columnId },
      });
    } catch (error) {
      throw new BadRequestException('카드 ID 조회 중 문제가 발생했습니다.');
    }

    const validTaskIds = taskIds.map((task) => task.id.toString());
    const isValidTaskOrder = taskOrderArray.every((id) =>
      validTaskIds.includes(id.toString()),
    );

    if (!isValidTaskOrder) {
      throw new BadRequestException('존재하지 않는 카드가 지정되었습니다.');
    }

    column.taskOrder = JSON.stringify(taskOrderArray);
    try {
      await this.columnRepository.save(column);
    } catch (error) {
      throw new BadRequestException(
        '컬럼 정보 업데이트 중 오류가 발생했습니다.',
      );
    }

    return column;
  }
}
