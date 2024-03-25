import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { BoardService } from '../board/board.service';
import {UserService} from '../user/user.service'
import {NotificationsService} from './notifications.service'
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private notificationsService: NotificationsService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const userId = this.extractUserId(client); 
    console.log("handleConnection" + userId)
    await this.notificationsService.saveWebSocketId(String(userId), client.id);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.extractUserId(client); 
    await this.notificationsService.removeWebSocketId(String(userId));
  }

  private extractUserId(client: Socket): number {
    return +client.handshake.query.userId;
  }
}

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

@WebSocketGateway()
export class BoardGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly boardService: BoardService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @SubscribeMessage('moveCard')
  async handleMoveCard(
    @MessageBody() data: { boardId: number; taskId: number; sourceColumnId: number; targetColumnId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { boardId, taskId, sourceColumnId, targetColumnId } = data;
    const members = await this.boardService.findUserIdsByBoardId(BigInt(boardId));
    const message = `태스크 ${taskId}번이 컬럼 ${sourceColumnId}번에서 ${targetColumnId}번으로 옮겨갔어요.`;
  
    for (const user of members) {
      const socketId = await this.notificationsService.getWebSocketId(user.userId.toString());

      if (socketId) {
        this.server.to(socketId).emit('cardMovedNotification', { message });
      }
    }
  }
  
}

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessageToBoard')
  async handleMessageToBoard(
    @MessageBody() data: { boardId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { boardId, message } = data;
    this.server.to(boardId).emit('receiveChatMessage', { message, senderId: client.id });
  }

  // 클라이언트가 특정 보드(방)에 입장
  @SubscribeMessage('joinBoard')
  handleJoinBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { boardId } = data;
    client.join(boardId);
    console.log(`Client ${client.id}가 접속했습니다.`);
  }

  // 클라이언트가 특정 보드(방)에서 퇴장
  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { boardId } = data;
    client.leave(boardId);
    console.log(`Client ${client.id}가 퇴장했습니다.`);
  }
}

