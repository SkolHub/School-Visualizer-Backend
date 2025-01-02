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

      await this.cacheManager.set('token', token);
    }

    return token;
  }

  async sendActivity(activityToken: string, payload: any) {
    await fetch(
      `https://api.sandbox.push.apple.com/3/device/${activityToken}`,
      {
        method: 'POST',
        headers: {
          'apns-topic':
            'ro.attractivestar.SchoolHubMobile.push-type.liveactivity',
          'apns-push-type': 'liveactivity',
          'apns-priority': '10',
          authorization: `bearer ${await this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aps: payload
        })
      }
    );
  }

  async sendBeginActivity(startToken: string, payload: TimeSlot) {
    const timestamp = Math.floor(Date.now() / 1000);
    const staleDate = Math.floor(Date.now() / 1000) + 3 * 60 * 60;

    const payload2 = {
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
    };

    await this.sendActivity(startToken, payload2);
  }

  async scheduleNextHour(updateToken: string, payload: TimeSlot) {
    const now = new Date().getTime();

    await this.sendActivity(updateToken, {
      timestamp: Math.floor(now / 1000),
      event: 'update',
      'content-state': payload
    });
  }

  async scheduleBeginHour(updateToken: string, payload: TimeSlot) {
    const now = new Date().getTime();

    await this.sendActivity(updateToken, {
      timestamp: Math.floor(now / 1000),
      event: 'update',
      'content-state': payload
    });
  }

  async sendEndActivity(updateToken: string, payload: TimeSlot) {
    const now = new Date().getTime();

    await this.sendActivity(updateToken, {
      timestamp: Math.floor(now / 1000),
      'dismissal-date': Math.floor(now / 1000),
      event: 'end',
      'content-state': payload
    });
  }

  async process(
    job: Job<NotificationInterface, any, 'start' | 'next' | 'end'>
  ): Promise<void> {
    const { deviceToken, payload } = job.data;

    const { updateToken, startToken, isLive, pauseUntil } = (
      await this.db
        .select()
        .from(users)
        .where(eq(users.deviceToken, deviceToken))
    )[0];

    if (pauseUntil !== null && pauseUntil > new Date()) {
      return;
    }

    if (!isLive) {
      if (job.name === 'end') {
        return;
      }

      await this.sendBeginActivity(startToken, payload);
      await this.db
        .update(users)
        .set({
          isLive: true
        })
        .where(eq(users.deviceToken, deviceToken));

      return;
    }

    switch (job.name) {
      case 'end':
        await this.sendEndActivity(updateToken, payload);

        await this.db
          .update(users)
          .set({
            isLive: false
          })
          .where(eq(users.deviceToken, deviceToken));

        return;

      case 'next':
        await this.scheduleNextHour(updateToken, payload);
        return;

      case 'start':
        await this.scheduleBeginHour(updateToken, payload);
        return;
    }
  }
}
