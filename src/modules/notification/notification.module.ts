import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NotificationController } from './notification.controller';
import { NotificationsProcessor } from './notification.processor';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    HttpModule
  ],
  controllers: [NotificationController],
  providers: [NotificationsProcessor, NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
