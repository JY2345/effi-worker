import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColumnEntity } from 'src/column/entities/column.entity';
import { User } from 'src/user/entities/user.entity';
import { Board } from './entities/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity, User, Board]), UserModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
