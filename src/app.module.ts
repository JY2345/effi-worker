import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ColumnModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
