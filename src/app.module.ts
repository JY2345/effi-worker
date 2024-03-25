import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnModule } from './column/column.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import { ColumnEntity } from './column/entities/column.entity';
import { BoardUser } from './board/entities/boardUser.entity';
import { TaskUser } from './task/entities/taskUser.entity';
import { Task } from './task/entities/task.entity';
import { Board } from './board/entities/board.entity';
import { Comment } from './comment/entities/comment.entity';

import { AuthModule } from './auth/auth.module';

import {
  NotificationsGateway,
  BoardGateway,
  AppGateway,
} from './notifications/notifications.gateway';
import { NotificationsModule } from './notifications/notifications.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NotificationsService } from './notifications/notifications.service';
import { BoardService } from './board/board.service';
import { join } from 'path';
import { MailerModule } from './mailer/mailer.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import mime from 'mime';
import { RedisCacheModule } from './cache/redis-cache.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, ColumnEntity, BoardUser, Task, TaskUser, Board, Comment],
    synchronize: configService.get('DB_SYNC'),
    logging: true, // row query 출력
  }),
  inject: [ConfigService],
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 사용 => 별도로 다른곳에서 import 하지 않아도 됨
      // 환경변수 유효성 검사
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ColumnModule,
    BoardModule,
    CommentModule,
    UserModule,
    AuthModule,
    NotificationsModule,
    TaskModule,
    RedisCacheModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/build'),
    }),
    MailerModule,
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, './file');
        },
        filename(req, file, callback) {
          callback(
            null,
            `${new Date().getTime()}.${mime.extension(file.mimetype)}`,
          );
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
        files: 1,
      },
      fileFilter(req, file, callback) {
        callback(null, true);
      },
    }),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    NotificationsGateway,
    NotificationsService,
    BoardGateway,
    BoardService,
  ],
})
export class AppModule {}
