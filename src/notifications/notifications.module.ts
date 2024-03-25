import { Module } from '@nestjs/common';
import { NotificationsGateway, BoardGateway, AppGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service';
import { BoardService } from '../board/board.service';
import { Board } from '../board/entities/board.entity';
import { BoardUser } from '../board/entities/boardUser.entity';
import { ColumnEntity } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from '../cache/redis-cache.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardUser, ColumnEntity, User]),
    RedisCacheModule
  ],
  providers: [NotificationsGateway, BoardGateway, AppGateway, BoardService, NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
