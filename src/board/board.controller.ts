import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

// jwt로 인증하기 @UseGuard(AuthGuard('jwt'))
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 인증받은 유저 데려오기 @UserInfo() user:User
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    const board = await this.boardService.create(createBoardDto);
    return {
      successMessage: '보드 생성에 성공하였습니다.',
      board,
    };
  }

  // 보드 조회
  @Get()
  async findAll() {
    const boards = await this.boardService.findAll();
    return {
      successMessage: '보드 조회에 성공하였습니다.',
      boards,
    };
  }

  // 보드 수정
  @Patch(':id')
  async update(
    @Param('id') id: bigint,
    /*@UserInfo() user:User, */ createBoardDto: CreateBoardDto,
  ) {
    //이건 지울것
    const user = {
      id: 1,
    };

    const board = await this.boardService.update(id, user.id, createBoardDto);
    return {
      successMessage: '보드 수정에 성공하였습니다.',
      board,
    };
  }

  // 보드 삭제

  // 보드 초대
}
