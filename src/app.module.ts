import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnModule } from './column/column.module';

@Module({
  imports: [ColumnModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
