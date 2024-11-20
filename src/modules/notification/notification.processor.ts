import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  async process(job: any) {
    const { message, userId } = job.data;
    await this.sendPushNotification(userId, message);
  }

  private async sendPushNotification(userId: string, message: string) {
    console.log(`Sending notification to user ${userId}: ${message}`);
  }
}
