import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Request,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserInfo } from 'src/user/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@UserInfo() user: User, @Body() createTaskDto: CreateTaskDto) {
    const data = await this.taskService.createTask(user.id, createTaskDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '카드 생성에 성공했습니다.',
      data,
    };
  }

  // 카드 목록조회
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('boardId') boardId: number) {
    console.log(boardId);
    const data = await this.taskService.findAll(boardId);

    return {
      statusCode: HttpStatus.OK,
      message: '카드 목록 조회에 성공했습니다.',
      data,
    };
  }

  // 카드 상세 조회
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.taskService.findOneTask(+id);

    return {
      statusCode: HttpStatus.OK,
      message: '카드 상세 조회에 성공했습니다.',
      data,
    };
  }

  // 카드 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @UserInfo() user: User,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const data = await this.taskService.updateTask(+id, user.id, updateTaskDto);

    return {
      statusCode: HttpStatus.OK,
      message: '카드 수정에 성공했습니다.',
      data,
    };
  }

  // 카드 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@UserInfo() user: User, @Param('id') id: number) {
    const data = await this.taskService.removeTask(+id, user.id);
    return {
      statusCode: HttpStatus.OK,
      message: '카드 삭제에 성공했습니다.',
      data,
    };
  }

}
