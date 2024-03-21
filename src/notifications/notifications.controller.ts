import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @Post('/send')
  sendNotification(@Body('message') message: string) {
    this.notificationsGateway.sendNotificationToAll(message);
    return { message: '알람 전송!' };
  }
}
