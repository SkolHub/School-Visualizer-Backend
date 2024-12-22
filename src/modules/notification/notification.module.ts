import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NotificationController } from './notification.controller';
import { NotificationsProcessor } from './notification.processor';
import { CacheModule } from '@nestjs/cache-manager';
import envConfig from '../../../env.config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      connection: {
        url: envConfig.REDIS_URL
      },
      defaultJobOptions: {
        removeOnComplete: true
      }
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 30
    })
  ],
  controllers: [NotificationController],
  providers: [NotificationsProcessor, NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
