import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnModule } from './column/column.module';
<<<<<<< Updated upstream

@Module({
  imports: [ColumnModule],
=======
<<<<<<< Updated upstream
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [ColumnModule, BoardModule],CommentModule,
=======
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [ColumnModule, CommentModule],
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
