import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from './entities/column.entity';
import { Board } from '../board/entities/board.entity';
@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnEntity)
    private columnRepository: Repository<ColumnEntity>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
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

  findOne(id: number) {
    return this.columnRepository.findOne({
      where: { id: id },
    });
  }

  async updateColumnName(id: number, updateColumnDto: UpdateColumnDto) {
    const existingColumn = await this.columnRepository.findOneBy({ id });

    if (!existingColumn) {
      throw new NotFoundException('존재하지 않는 컬럼입니다.');
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

  async removeColumn(id: number) {
    const existingColumn = await this.columnRepository.findOne({
      where: { id: id },
      select: ['id', 'name'],
    });

    if (!existingColumn) {
      throw new NotFoundException('존재하지 않는 컬럼입니다.');
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
}
