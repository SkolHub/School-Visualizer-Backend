import { Inject } from '@nestjs/common';
import { ClsService, ClsStore } from 'nestjs-cls';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NotificationService } from '../modules/notification/notification.service';

export interface CustomClsStore extends ClsStore {
  token: string;
}

export abstract class DBService {
  @Inject('DB')
  protected readonly db: NodePgDatabase;

  @Inject()
  private readonly clsService: ClsService<CustomClsStore>;

  get token(): string {
    return this.clsService.get('token');
  }
}
