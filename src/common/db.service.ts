import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export abstract class DBService {
  @Inject('DB')
  protected readonly db: NodePgDatabase;
}
