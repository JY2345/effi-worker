import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, ChgTaskColDto } from './dto/update-task.dto';
import { UserInfo } from '../user/utils/userInfo.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AddWorkerTaskDto } from './dto/add-worker-task.dto';

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
  @Get('get-all/:columnId')
  async findAll(@Param('columnId') columnId: number) {
    const data = await this.taskService.findAll(columnId);
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
  @Patch('chg-task/:id')
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
  
  // 카드 다른 컬럼으로 이동
  @UseGuards(AuthGuard('jwt'))
  @Patch('chg-task-col')
  async moveTask(
    @Body() chgTaskColDto: ChgTaskColDto,
  ) {
    const data = await this.taskService.moveTask(chgTaskColDto);

    return {
      statusCode: HttpStatus.OK,
      message: '카드 이동에 성공했습니다.',
      data,
    };
  }


  // 카드 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('card/:id')
  async remove(@UserInfo() user: User, @Param('id') id: number) {
    const data = await this.taskService.removeTask(+id, user.id);
    return {
      statusCode: HttpStatus.OK,
      message: '카드 삭제에 성공했습니다.',
      data,
    };
  }

  // 카드 담당자 추가
  @UseGuards(AuthGuard('jwt'))
  @Post('add-worker')
  async addWorker(
    @Body() addWorkerTaskDto: AddWorkerTaskDto,
  ) {
    const addWorker = await this.taskService.addWorker(
      addWorkerTaskDto,
    );
    return { successMessage: `작업자가 성공적으로 추가되었습니다.` };
  }

  // 카드 담당자 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-worker')
  async removeWorker(
    @Body() addWorkerTaskDto: AddWorkerTaskDto,
    @Param('workerId') workerId : number
  ) {
    console.log("addWorkerTaskDto:", addWorkerTaskDto);
    console.log("addWorkerTaskDto:", addWorkerTaskDto);
    await this.taskService.removeWorker(addWorkerTaskDto);
    return { successMessage: `작업자가 성공적으로 삭제되었습니다.`};
  }

  // 카드 작업자 보기
  @UseGuards(AuthGuard('jwt'))
  @Get('get-workers/:taskId')
  getWorkers(@Param('taskId') taskId: number) {
    return this.taskService.getWorkers(+taskId);
  }

}
