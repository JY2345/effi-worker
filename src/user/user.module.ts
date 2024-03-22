import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => MailerModule),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
