import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const { name, color, info } = createBoardDto;
    // board생성
    const board = await this.boardRepository.save({
      name,
      color,
      info,
    });

    // boardId를 가지고 BoardUser테이블 생성

    console.log('board => ', board);
  }
}
