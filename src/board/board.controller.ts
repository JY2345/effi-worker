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

// jwt로 인증하기 @UseGuard(AuthGuard('jwt'))
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 인증받은 유저 데려오기 @UserInfo() user:User
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardService.create(createBoardDto);
  }

  // 보드 조회
  @Get()
  async findAll() {
    return await this.boardService.findAll();
  }

  // 보드 수정

  // 보드 삭제

  // 보드 초대
}
