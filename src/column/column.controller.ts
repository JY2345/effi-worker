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
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnEntity } from './entities/column.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('예약 정보')
@Controller('column')
@ApiBearerAuth('access-token')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  
  @UseGuards(AuthGuard('jwt'))
  @Post('create-column')
  create(@Body() createColumnDto: CreateColumnDto): Promise<ColumnEntity> {
    return this.columnService.createColumn(createColumnDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-all/:boardId')
  findAllColumnsInBoard(@Param('boardId') boardId: number) {
    return this.columnService.findAllColumnsInBoard(+boardId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateColumnName(
    @Param('id') id: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnService.updateColumnName(+id, updateColumnDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async removeColumn(@Param('id') id: number) {
    return this.columnService.removeColumn(+id);
  }
}
