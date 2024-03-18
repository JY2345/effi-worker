import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnModule } from './column/column.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [ColumnModule, BoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
