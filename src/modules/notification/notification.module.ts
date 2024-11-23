import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NotificationController } from './notification.controller';
import { NotificationsProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      connection: {
        host: 'localhost',
        port: 6379
      }
    })
  ],
  controllers: [NotificationController],
  providers: [NotificationsProcessor, NotificationService]
})
export class NotificationModule {}
