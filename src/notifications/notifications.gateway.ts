import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendNotification')
  handleNotification(client: any, payload: any): void {
    this.server.emit('receiveNotification', payload);
  }

  sendNotificationToAll(message: string) {
    this.server.emit('receiveNotification', { message });
  }
}
