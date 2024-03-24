import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketStateService {
  private userIdToSocketIdMap = {};

  setUserSocketId(userId: string, socketId: string) {
    this.userIdToSocketIdMap[userId] = socketId;
  }

  removeUserSocketId(userId: string) {
    delete this.userIdToSocketIdMap[userId];
  }

  findSocketIdByUserId(userId: string): string | undefined {
    return this.userIdToSocketIdMap[userId];
  }
}

