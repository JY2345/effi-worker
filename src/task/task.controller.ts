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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.id;

    const data = await this.taskService.createTask(userId, createTaskDto);
    return {
      stausCode: HttpStatus.CREATED,
      message: '카드 생성에 성공했습니다.',
      data,
    };
  }

  @Get()
  async findAll() {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.taskService.findOne(+id);
  }

  // 카드 수정
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Request() req,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = req.user.id;

    const data = await this.taskService.updateTask(userId, +id, updateTaskDto);

    return {
      stausCode: HttpStatus.OK,
      message: '카드 수정에 성공했습니다.',
      data,
    };
  }

  // 카드 삭제
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;

    const data = await this.taskService.removeTask(userId, +id);
    return {
      stausCode: HttpStatus.OK,
      message: '카드 삭제에 성공했습니다.',
      data,
    };
  }
}
