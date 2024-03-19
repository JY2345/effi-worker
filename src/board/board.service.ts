import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteBoardDto } from './dto/inviteBoard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { FindOperator, In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { BoardUser } from './entities/boardUser.entity';
import { ColumnEntity } from 'src/column/entities/column.entity';
import { number } from 'joi';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UpdateColumnOrderDto } from './dto/update-column-order.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  // board생성
  async create(createBoardDto: CreateBoardDto) {
    const { name, color, info } = createBoardDto;

    return await this.boardRepository.save({
      userId: 1,
      name,
      color,
      info,
    });
  }

  // 보드 조회
  async findAll() {
    return await this.boardRepository.find({
      select: ['id', 'name', 'color', 'info', 'createdAt'],
    });
  }

  // 보드 수정
  async update(id: bigint, userId: number, updateBoardDto: UpdateBoardDto) {
    // userTable의 findById같은 아이디 찾는것 가져오기
    const { name, color, info } = updateBoardDto;

    const board = await this.findById(id);

    if (board.userId !== userId) {
      throw new ForbiddenException('수정할 권한이 없습니다.');
    }

    await this.boardRepository.update(
      { id },
      {
        name,
        color,
        info,
      },
    );

    return await this.findById(id);
  }

  // 보드 삭제
  async delete(id: bigint, userId: number) {
    const board = await this.findById(id);
    if (board.userId !== userId) {
      throw new ForbiddenException('삭제할 권한이 없습니다.');
    }

    await this.boardRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  // 보드 초대
  async invite(id: bigint, userId: number, inviteUser: InviteBoardDto) {
    const { inviteId } = inviteUser;

    const board = await this.findById(id);
    if (board.userId !== userId) {
      throw new ForbiddenException('초대할 권한이 없습니다.');
    }

    const boards = await this.boardUserRepository.find({
      select: ['userId'],
      where: { boardId: id },
    });

    inviteId.push(userId);

    const invitedUserId = boards.map((board) => {
      return board.userId;
    });
    console.log('invitedUserId => ', invitedUserId);

    for (let i = inviteId.length - 1; i >= 0; i--) {
      if (invitedUserId.includes(inviteId[i])) {
        inviteId.splice(i, 1);
      }
    }

    const InsertData = inviteId.map((inviteUserNum) => ({
      boardId: id,
      userId: inviteUserNum,
    }));

    // bulk insert 방식 적용
    await this.boardUserRepository
      .createQueryBuilder()
      .insert()
      .values(InsertData)
      .execute();

    // 총 초대된 인원
    const count = await this.boardUserRepository.count({
      where: { boardId: id },
    });

    return count;
  }

  // 보드 아이디 검색 함수
  async findById(id: bigint) {
    const board = await this.boardRepository.findOne({
      where: { id },
    });
    console.log('id => ', id);
    console.log('board => ', board);

    return board;
  }

  // ColumnOrder 업데이트
  async updateColumnOrder(
    boardId: number,
    updateColumnOrderDto: UpdateColumnOrderDto,
  ): Promise<Board> {
    let board;
    try {
      board = await this.boardRepository.findOneBy({ id: BigInt(boardId) });
    } catch (error) {
      throw new BadRequestException('보드 ID가 유효한 숫자 형식이 아닙니다.');
    }

    if (!board) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }

    let columnOrderArray: readonly any[] | FindOperator<any>;
    try {
      columnOrderArray = JSON.parse(updateColumnOrderDto.columnOrder);
    } catch (error) {
      throw new BadRequestException(
        '제공된 컬럼 순서가 유효한 JSON 형식이 아닙니다.',
      );
    }

    if (!Array.isArray(columnOrderArray)) {
      throw new BadRequestException('컬럼 순서는 배열이어야 합니다.');
    }

    let columnIds: any[];
    try {
      columnIds = await this.columnRepository.find({
        where: { id: In(columnOrderArray) },
      });
    } catch (error) {
      throw new BadRequestException('컬럼 ID 조회 중 문제가 발생했습니다.');
    }

    const validColumnIds = columnIds.map((column) => column.id.toString());
    const isValidColumnOrder = columnOrderArray.every((id) =>
      validColumnIds.includes(id.toString()),
    );

    if (!isValidColumnOrder) {
      throw new BadRequestException('존재하지 않는 컬럼이 지정되었습니다.');
    }

    board.columnOrder = JSON.stringify(columnOrderArray);
    try {
      await this.boardRepository.save(board);
    } catch (error) {
      throw new BadRequestException(
        '보드 정보 업데이트 중 오류가 발생했습니다.',
      );
    }

    return board;
  }
}
