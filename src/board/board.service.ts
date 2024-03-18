import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly userService: UserService,
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
  async update(createBoardDto: CreateBoardDto, userId: User) {
    // userTable의 findById같은 아이디 찾는것 가져오기
    // const user = await this.userService.findbyId(userId)
  }

  // 보드 삭제

  // 보드 초대
}
