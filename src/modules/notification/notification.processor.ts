import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import envConfig from '../../../env.config';
import { TimeSlot } from '../../types/types';
import { sign } from 'jsonwebtoken';
import { fetch } from 'fetch-http2';

interface NotificationInterface {
  deviceToken: string;
  payload: TimeSlot;
}

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('DB') protected readonly db: NodePgDatabase
  ) {
    super();
  }

  async getToken() {
    let token: string = await this.cacheManager.get('token');

    if (!token) {
      try {
        token = sign(
          {
            iss: envConfig.TEAM_ID,
            iat: Math.floor(Date.now() / 1000)
          },
          envConfig.AUTH_KEY,
          {
            header: {
              alg: 'ES256',
              kid: envConfig.KEY_ID
            },
            algorithm: 'ES256'
          }
        );
      } catch (e) {
        console.log(e);
      }

      await this.cacheManager.set('token', token);
    }

    return token;
  }

  async sendBeginActivity(
    startToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    console.log('Begin activity', startToken, payload, authToken);

    const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    const staleDate = Math.floor(Date.now() / 1000) + 3 * 60 * 60; // Current time + 3 hours in seconds

    const payload2 = {
      aps: {
        timestamp: timestamp,
        'stale-date': staleDate,
        event: 'start',
        'content-state': payload,
        'attributes-type': 'TimetableAttributes',
        attributes: payload,
        alert: {
          title: 'test sau text',
          body: 'test sau text'
        }
      }
    };

    try {
      const response = await fetch(
        `https://api.sandbox.push.apple.com/3/device/${startToken}`,
        {
          method: 'POST',
          headers: {
            'apns-topic': 'ro.attractivestar.SchoolHubMobile.push-type.liveactivity',
            'apns-push-type': 'liveactivity',
            'apns-priority': '10',
            authorization: `bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload2)
        }
      );

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  async sendEndActivity(
    updateToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    const now = new Date().getTime();

    console.log('End activity', updateToken, payload, authToken);

    try {
      const response = await fetch(
        `https://api.sandbox.push.apple.com/3/device/${updateToken}`,
        {
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
              timestamp: Math.floor(now / 1000),
              'dismissal-date': Math.floor(now / 1000),
              event: 'end',
              'content-state': payload
            }
          })
        }
      );

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  async scheduleNextHour(
    updateToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    const now = new Date().getTime();

    console.log('Next hour', updateToken, payload, authToken);

    try {
      const response = await fetch(
        `https://api.sandbox.push.apple.com/3/device/${updateToken}`,
        {
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
              timestamp: Math.floor(now / 1000),
              event: 'update',
              'content-state': payload
            }
          })
        }
      );

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  async scheduleBeginHour(
    updateToken: string,
    payload: TimeSlot,
    authToken: string
  ) {
    const now = new Date().getTime();

    console.log('Begin hour', updateToken, payload, authToken);

    try {
      const response = await fetch(
        `https://api.sandbox.push.apple.com/3/device/${updateToken}`,
        {
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
              timestamp: Math.floor(now / 1000),
              event: 'update',
              'content-state': payload
            }
          })
        }
      );

      console.log(response);
    } catch (e) {
      console.log(e);
    }
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

    console.log('Processing notification');

    switch (job.name) {
      case 'first':
        await this.sendBeginActivity(startToken, payload, authToken);
        return;

      case 'end':
        await this.sendEndActivity(updateToken, payload, authToken);
        return;

      case 'next':
        await this.scheduleNextHour(updateToken, payload, authToken);
        return;

      case 'start':
        await this.scheduleBeginHour(updateToken, payload, authToken);
        return;
    }
  }
}
