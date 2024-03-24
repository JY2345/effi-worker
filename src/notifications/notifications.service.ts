import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class NotificationsService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  // 웹소켓 ID 저장
  async saveWebSocketId(userId: string, socketId: string): Promise<void> {
    await this.cacheManager.set(`socket:${userId}`, socketId, { ttl: 0 });
  }

  // 웹소켓 ID 조회
  async getWebSocketId(userId: string): Promise<string | null> {
    const socketId = await this.cacheManager.get<string>(`socket:${userId}`);
    return socketId;
  }

  // 웹소켓 ID 삭제
  async removeWebSocketId(userId: string): Promise<void> {
    await this.cacheManager.del(`socket:${userId}`);
  }
}
