import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Notification, Provider } from 'apn';

interface NotificationInterface {
  deviceToken: string;
  name: string;
}

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private apnProvider: Provider;

  constructor() {
    super();
    this.apnProvider = new Provider({
      token: {
        key: 'path/to/AuthKey.p8',
        keyId: 'your-key-id',
        teamId: 'your-team-id'
      },
      production: false
    });
  }

  async process(job: Job<NotificationInterface>): Promise<void> {
    console.log(job.data);

    const { deviceToken, name } = job.data;

    const notification = new Notification();
    notification.alert = name;
    notification.payload = 'text';
    notification.topic = 'com.example.app';

    try {
      const result = await this.apnProvider.send(notification, deviceToken);
      console.log('Notification sent:', result);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
