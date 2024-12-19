import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NotificationController } from './notification.controller';
import { NotificationsProcessor } from './notification.processor';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
    CacheModule.register()
  ],
  controllers: [NotificationController],
  providers: [NotificationsProcessor, NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
