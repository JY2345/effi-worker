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
  /*@UserInfo() user:User, */
  @Patch(':id')
  async update(
    @Param('id') id: bigint,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    //이건 지울것
    const user = {
      id: 1,
    };

    const board = await this.boardService.update(id, user.id, updateBoardDto);
    return {
      successMessage: '보드 수정에 성공하였습니다.',
      board,
    };
  }

  // 보드 삭제
  @Delete(':id')
  async delete(@Param('id') id: bigint /*@UserInfo() user:User, */) {
    //이건 지울것
    const user = {
      id: 2,
    };

    await this.boardService.delete(id, user.id);

    return { successMessage: '보드 삭제에 성공하였습니다.' };
  }

  // 보드 초대
  @Post(':id')
  async invite(
    @Param('id') id: bigint,
    /*@UserInfo() user:User, */ @Body() inviteBoardDto: InviteBoardDto,
  ) {
    //이건 지울것
    const user = {
      id: 1,
    };
    const inviteCount = await this.boardService.invite(
      id,
      user.id,
      inviteBoardDto,
    );

    return { successMessage: `현재 일잘러 참가 인원 : ${inviteCount}명` };
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
