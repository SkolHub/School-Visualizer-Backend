import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

interface NotificationInterface {
  deviceToken: string;
  name: string;
}

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('DB') protected readonly db: NodePgDatabase
  ) {
    super();
  }

  async getToken() {
    let token = await this.cacheManager.get('token');

    if (!token) {
      token = this.jwtService.sign({
        alg: 'ES256',
        kid: '',
        iss: '',
        iat: Math.floor(Date.now() / 1000)
      });

      await this.cacheManager.set('token', token);
    }
  }

  async sendBeginActivity(startToken: string, payload: any) {

  }

  async sendEndActivity(updateToken: string, payload: any) {}

  async scheduleNextHour(updateToken: string, payload: any) {}

  async scheduleBeginHour(updateToken: string, payload: any) {}

  async process(job: Job<NotificationInterface>): Promise<void> {
    const { deviceToken, name } = job.data;

    const { updateToken, startToken } = (
      await this.db
        .select()
        .from(users)
        .where(eq(users.deviceToken, deviceToken))
    )[0];

    switch (name) {
      case 'first':
        await this.sendBeginActivity(startToken, job.data);
        break;
      case 'end':
        await this.sendEndActivity(updateToken, job.data);
        break;

      case 'next':
        await this.scheduleNextHour(updateToken, job.data);
        break;

      case 'start':
        await this.scheduleBeginHour(updateToken, job.data);
        break;
    }
  }
}
