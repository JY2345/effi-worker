import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { Response } from 'express';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('confirm')
  async emailConfirm(@Body('email') email: string) {
    return this.mailerService.sendEmail(email);
  }

  @Get('check')
  async checkEncryptMessage(@Res() res: Response, @Query('q') q: string) {
    const token = decodeURIComponent(q);
    const verificationStatus = await this.mailerService.checkToken(token);

    switch (verificationStatus) {
      case 'success':
        res.send('이메일 주소가 성공적으로 확인되었습니다.');
        break;
      case 'expired':
        res.send(
          '이메일 확인이 만료되었습니다. 새로운 확인 이메일을 요청하십시오.',
        );
        break;
      case 'no exists':
        res.send('일치하는 사용자가 없습니다.');
        break;
      case 'token no exists':
        res.send(
          '토큰이 없거나 만료되었습니다. 새로운 확인 이메일을 요청하십시오.',
        );
        break;
      default:
        res.send('인증 오류가 발생했습니다.');
        break;
    }
  }
}
