import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import envConfig from '../../../env.config';
import { TimeSlot } from '../../types/types';

interface NotificationInterface {
  deviceToken: string;
  payload: TimeSlot;
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
    let token: string = await this.cacheManager.get('token');

    if (!token) {
      token = this.jwtService.sign(
        {
          iss: envConfig.TEAM_ID,
          iat: Math.floor(Date.now() / 1000)
        },
        {
          header: {
            alg: 'ES256',
            kid: envConfig.KEY_ID
          },
          algorithm: 'ES256'
        }
      );

      await this.cacheManager.set('token', token);
    }

    return token;
  }

  async sendBeginActivity(
    startToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    const now = new Date().getTime();

    await fetch(`https://api.sandbox.push.apple.com/3/device/${startToken}`, {
      method: 'POST',
      headers: {
        'apns-topic':
          'ro.attractivestar.SchoolHubMobile.push-type.liveactivity',
        'apns-push-type': 'liveactivity',
        'apns-priority': '10',
        authorization: `bearer ${authToken}`
      },
      body: JSON.stringify({
        aps: {
          timestamp: now,
          'stale-date': now / 1000 + 60 * 60,
          event: 'start',
          'content-state': payload,
          'attributes-type': 'TimetableAttributes',
          attributes: payload
        }
      })
    });
  }

  async sendEndActivity(
    updateToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    const now = new Date().getTime();

    await fetch(`https://api.sandbox.push.apple.com/3/device/${updateToken}`, {
      method: 'POST',
      headers: {
        'apns-topic':
          'ro.attractivestar.SchoolHubMobile.push-type.liveactivity',
        'apns-push-type': 'liveactivity',
        'apns-priority': '10',
        authorization: `bearer ${authToken}`
      },
      body: JSON.stringify({
        aps: {
          timestamp: now,
          'dismissal-date': now,
          event: 'end',
          'content-state': payload
        }
      })
    });
  }

  async scheduleNextHour(
    updateToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    const now = new Date().getTime();

    await fetch(`https://api.sandbox.push.apple.com/3/device/${updateToken}`, {
      method: 'POST',
      headers: {
        'apns-topic':
          'ro.attractivestar.SchoolHubMobile.push-type.liveactivity',
        'apns-push-type': 'liveactivity',
        'apns-priority': '10',
        authorization: `bearer ${authToken}`
      },
      body: JSON.stringify({
        aps: {
          timestamp: now,
          event: 'update',
          'content-state': payload
        }
      })
    });
  }

  async scheduleBeginHour(
    updateToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    const now = new Date().getTime();

    await fetch(`https://api.sandbox.push.apple.com/3/device/${updateToken}`, {
      method: 'POST',
      headers: {
        'apns-topic':
          'ro.attractivestar.SchoolHubMobile.push-type.liveactivity',
        'apns-push-type': 'liveactivity',
        'apns-priority': '10',
        authorization: `bearer ${authToken}`
      },
      body: JSON.stringify({
        aps: {
          timestamp: now,
          event: 'update',
          'content-state': payload
        }
      })
    });
  }

  async process(job: Job<NotificationInterface>): Promise<void> {
    const { deviceToken, payload } = job.data;

    const { updateToken, startToken } = (
      await this.db
        .select()
        .from(users)
        .where(eq(users.deviceToken, deviceToken))
    )[0];

    const authToken = await this.getToken();

    switch (job.name) {
      case 'first':
        await this.sendBeginActivity(startToken, payload, authToken);
        break;
      case 'end':
        await this.sendEndActivity(updateToken, payload, authToken);
        break;

      case 'next':
        await this.scheduleNextHour(updateToken, payload, authToken);
        break;

      case 'start':
        await this.scheduleBeginHour(updateToken, payload, authToken);
        break;
    }
  }
}
