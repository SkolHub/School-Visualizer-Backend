import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import envConfig from '../../../env.config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeepAliveService {
  constructor(private readonly httpService: HttpService) {}

  ping() {
    console.log('ping');

    return 'pong';
  }

  @Cron('0 */10 * * * *')
  async keepAlive() {
    await firstValueFrom(this.httpService.get(`${envConfig.HOST_URL}/ping`));
  }
}
