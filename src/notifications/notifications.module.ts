import { Module } from '@nestjs/common';
import { NotificationsGateway, BoardGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';
import { SocketStateService } from './notifications.service';
import { BoardService } from '../board/board.service';
import { Board } from '../board/entities/board.entity';
import { BoardUser } from '../board/entities/boardUser.entity';
import { ColumnEntity } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardUser, ColumnEntity, User]),
  ],
  providers: [NotificationsGateway, BoardGateway, SocketStateService, BoardService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
