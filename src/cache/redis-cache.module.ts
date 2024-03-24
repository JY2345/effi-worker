import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 앱 전역에서 ConfigModule을 사용할 수 있도록 합니다.
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = {
          isGlobal: true,
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          auth_pass: configService.get('REDIS_PASSWORD'),
        };
        console.log('Redis Config:', redisConfig);
        return redisConfig;
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
