import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TimeSlot } from '../../types/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { sign } from 'jsonwebtoken';
import envConfig from '../../../env.config';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async scheduleNotification(
    deviceToken: string,
    payload: any,
    type: 'first' | 'start' | 'end' | 'next',
    delay: number
  ): Promise<void> {
    await this.notificationsQueue.add(
      type,
      {
        deviceToken,
        payload
      },
      {
        delay
      }
    );
  }

  async scheduleBeginActivity(
    deviceToken: string,
    payload: TimeSlot,
    delay: number
  ) {
    await this.scheduleNotification(deviceToken, payload, 'first', delay);
  }

  async scheduleEndActivity(deviceToken: string, delay: number) {
    await this.scheduleNotification(deviceToken, {}, 'end', delay);
  }

  async scheduleNextHour(
    deviceToken: string,
    payload: TimeSlot,
    delay: number
  ) {
    await this.scheduleNotification(deviceToken, payload, 'next', delay);
  }

  async scheduleBeginHour(
    deviceToken: string,
    payload: TimeSlot,
    delay: number
  ) {
    await this.scheduleNotification(deviceToken, payload, 'start', delay);
  }

  async clearNotifications(deviceToken: string): Promise<void> {
    const jobs = await this.notificationsQueue.getJobs();

    for (const job of jobs) {
      if (job.data.deviceToken === deviceToken) {
        await job.remove();
      }
    }
  }

  async getNotifications(): Promise<any> {
    return await this.notificationsQueue.getJobs();
  }

  async deleteNotifications(): Promise<void> {
    const jobs = await this.notificationsQueue.getJobs();

    for (const job of jobs) {
      await job.remove();
    }
  }

  async test2() {
    const token = sign(
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

    return token;
  }
}
