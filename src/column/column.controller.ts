import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnEntity } from './entities/column.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('예약 정보')
@Controller('column')
@ApiBearerAuth('access-token')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post('create-column')
  create(@Body() createColumnDto: CreateColumnDto): Promise<ColumnEntity> {
    return this.columnService.createColumn(createColumnDto);
  }

  @Get('get-all/:boardId')
  findAllColumnsInBoard(@Param('boardId') boardId: number) {
    return this.columnService.findAllColumnsInBoard(+boardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnService.findOne(+id);
  }

  @Patch(':id')
  updateColumnName(
    @Param('id') id: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnService.updateColumnName(+id, updateColumnDto);
  }

  @Delete(':id')
  async removeColumn(@Param('id') id: number) {
    return this.columnService.removeColumn(+id);
  }
}
