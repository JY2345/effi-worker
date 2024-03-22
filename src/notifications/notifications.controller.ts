import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsGateway
  // , ChatGateway 
} from './notifications.gateway';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    // private readonly chatGateway: ChatGateway 
  ) {}


  @Post('/send')
  sendNotification(@Body('message') message: string) {
    this.notificationsGateway.sendNotificationToAll(message);
    return { message: '알람 전송!' };
  }

  // @Post('/chat')
  // sendMessage(@Body() body: { boardId: string; message: string }) {
  //   this.chatGateway.handleMessageToBoard({
  //     boardId: body.boardId, 
  //     message: body.message
  //   }, /* 필요한 Socket 객체 */);
  //   return { message: '메시지 전송!' };
  // }
}
