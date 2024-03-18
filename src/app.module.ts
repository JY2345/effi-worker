<<<<<<< HEAD
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
=======
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnModule } from './column/column.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ColumnModule, BoardModule, CommentModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
>>>>>>> 63d359fe17b7ad805b057841d22b807b9466f378
