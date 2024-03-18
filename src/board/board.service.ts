import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteBoardDto } from './dto/inviteBoard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { BoardUser } from './entities/boardUser.entity';
import { number } from 'joi';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>,
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
  async update(id: bigint, userId: number, createBoardDto: CreateBoardDto) {
    // userTable의 findById같은 아이디 찾는것 가져오기
    const { name, color, info } = createBoardDto;
    const board = await this.findById(id);
    if (board.userId !== userId) {
      throw new ForbiddenException('수정할 권한이 없습니다.');
    }

    const updateBoard = await this.boardRepository.save({
      name,
      color,
      info,
    });

    return updateBoard;
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

    inviteId.push(userId);

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

    return board;
  }
}
