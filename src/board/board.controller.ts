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
import { InviteBoardDto } from './dto/inviteBoard.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UpdateColumnOrderDto } from './dto/update-column-order.dto';
import { UserInfo } from 'src/user/utils/userInfo.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 보드 생성
  @Post()
  async create(@UserInfo() user: User, @Body() createBoardDto: CreateBoardDto) {
    const board = await this.boardService.create(createBoardDto, user);
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
    @UserInfo() user: User,
    @Param('id') id: bigint,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const board = await this.boardService.update(id, user.id, updateBoardDto);
    return {
      successMessage: '보드 수정에 성공하였습니다.',
      board,
    };
  }

  // 보드 삭제
  @Delete(':id')
  async delete(@Param('id') id: bigint, @UserInfo() user: User) {
    await this.boardService.delete(id, user.id);
    return { successMessage: '보드 삭제에 성공하였습니다.' };
  }

  // 보드 초대
  @Post(':id')
  async invite(
    @Param('id') id: bigint,
    @UserInfo() user: User,
    @Body() inviteBoardDto: InviteBoardDto,
  ) {
    const inviteCount = await this.boardService.invite(
      id,
      user.id,
      inviteBoardDto,
    );
    return { successMessage: `현재 일잘러 참가 인원 : ${inviteCount}명` };
  }

  @Get(':id')
  async detailBoard(@Param('id') id: bigint, @UserInfo() user: User) {
    const board = await this.boardService.detailBoard(id, user.id);
    return { successMessage: `보드 상세조회에 성공하였습니다.`, board };
  }

  // 컬럼 순서 변경 저장
  @Patch('column-order/:id')
  async updateColumnOrder(
    @Param('id') id: number,
    @Body() updateColumnOrderDto: UpdateColumnOrderDto,
  ) {
    return this.boardService.updateColumnOrder(+id, updateColumnOrderDto);
  }
}
