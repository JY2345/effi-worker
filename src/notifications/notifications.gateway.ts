import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


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


// @WebSocketGateway()
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;

//   // 특정 보드에 메시지 보내기
//   @SubscribeMessage('sendMessageToBoard')
//   async handleMessageToBoard(
//     @MessageBody() data: { boardId: string; message: string },
//     @ConnectedSocket() client: Socket,
//   ): Promise<void> {
//     const { boardId, message } = data;
//     // 해당 보드의 모든 클라이언트에게 메시지 전송
//     this.server.to(boardId).emit('receiveChatMessage', { message, senderId: client.id });
//   }

//   // 클라이언트가 특정 보드(방)에 입장
//   @SubscribeMessage('joinBoard')
//   handleJoinBoard(
//     @MessageBody() data: { boardId: string },
//     @ConnectedSocket() client: Socket,
//   ): void {
//     const { boardId } = data;
//     client.join(boardId);
//     console.log(`Client ${client.id} joined board ${boardId}`);
//   }

//   // 클라이언트가 특정 보드(방)에서 퇴장
//   @SubscribeMessage('leaveBoard')
//   handleLeaveBoard(
//     @MessageBody() data: { boardId: string },
//     @ConnectedSocket() client: Socket,
//   ): void {
//     const { boardId } = data;
//     client.leave(boardId);
//     console.log(`Client ${client.id} left board ${boardId}`);
//   }
// }

