import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { SocketStateService } from './notifications.service';
import { BoardService } from '../board/board.service';
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

  private userIdToSocketIdMap = {};

  handleConnection(client: Socket, ...args: any[]) {
    const userId = this.extractUserIdFromConnection(client);
    this.onUserConnected(client, userId);
  }

  handleDisconnect(client: Socket) {
    const userId = this.extractUserIdFromDisconnection(client);
    this.onUserDisconnected(userId);
  }

  onUserConnected(socket: Socket, userId: string) {
    this.userIdToSocketIdMap[userId] = socket.id;
  }

  onUserDisconnected(userId: string) {
    delete this.userIdToSocketIdMap[userId];
  }

  private extractUserIdFromConnection(client: Socket): string {
    // 예시 구현
    return client.handshake.query.userId as string;
  }

  private extractUserIdFromDisconnection(client: Socket): string {
    return client.handshake.query.userId as string;
  }
}

@WebSocketGateway()
export class BoardGateway {
  @WebSocketServer() server: Server;

  constructor(
    private socketStateService: SocketStateService,
    private readonly boardService: BoardService
  ) {}

  @SubscribeMessage('moveCard')
  async handleMoveCard(
    @MessageBody() data: { boardId: number; taskId: number; sourceColumnId: number; targetColumnId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { boardId, taskId, sourceColumnId, targetColumnId } = data;
    const members = await this.boardService.findUserIdsByBoardId(BigInt(boardId));
    const message = `태스크 ${taskId}번이 컬럼 ${sourceColumnId}번에서 ${targetColumnId}번으로 옮겨갔어요.`;
    console.log("members : "+JSON.stringify(members))
    console.log("message : "+message)
    for (const user of members) {
      const socketId = this.socketStateService.findSocketIdByUserId(user.userId.toString());
      console.log("socketId : " + socketId);
      console.log("users.userId : " + user.userId);
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
    console.log(`Client ${client.id} joined board ${boardId}`);
  }

  // 클라이언트가 특정 보드(방)에서 퇴장
  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { boardId } = data;
    client.leave(boardId);
    console.log(`Client ${client.id} left board ${boardId}`);
  }
}

