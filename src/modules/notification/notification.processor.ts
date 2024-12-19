import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface NotificationInterface {
  deviceToken: string;
  name: string;
}

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async process(job: Job<NotificationInterface>): Promise<void> {
    const { deviceToken, name } = job.data;

    console.log(job.data);

    console.log(
      await firstValueFrom(this.httpService.post(`https://api.push.apple.com/3/device/${deviceToken}`, {}, {}))
    );
  }
}
