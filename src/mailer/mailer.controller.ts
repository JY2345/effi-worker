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
    const responseMessage =
      this.mailerService.handleResponsePage(verificationStatus);
    res.send(responseMessage);
  }
}
