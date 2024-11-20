import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class NotificationService {
  constructor(@InjectQueue('notifications') private notificationQueue: Queue) {}

  async scheduleNotification(hour: string, message: string, userId: string) {
    const delay = this.calculateDelay(hour);
    await this.notificationQueue.add(
      'sendNotification',
      { message, userId },
      { delay }
    );
  }

  private calculateDelay(hour: string): number {
    const [hours, minutes] = hour.split(':').map(Number);
    const now = new Date();
    const notificationTime = new Date(now);
    notificationTime.setHours(hours, minutes, 0, 0);
    return notificationTime.getTime() - now.getTime();
  }
}
