import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue
  ) {}

  async sendNotification(
    deviceToken: string,
    message: string,
    payload: any
  ): Promise<void> {
    await this.notificationsQueue.add('sendNotification', {
      deviceToken,
      message,
      payload
    });

    console.log('notification added');
  }

  async scheduleNotification(
    deviceToken: string,
    message: string,
    payload: any,
    delay: number
  ): Promise<void> {
    await this.notificationsQueue.add(
      'sendNotification',
      { deviceToken, message, payload },
      { delay }
    );
  }

  async removeScheduledNotification(jobId: string): Promise<void> {
    const job = await this.notificationsQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }
}
