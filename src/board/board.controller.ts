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

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // jwt로 인증하기 @UseGuard(AuthGuard('jwt'))
  // 인증받은 유저 데려오기 @UserInfo() user:User
  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    const userId: bigint = BigInt(1);
    return this.boardService.create(createBoardDto, userId);
  }
}
