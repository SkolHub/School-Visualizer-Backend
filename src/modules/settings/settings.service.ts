import { Injectable } from '@nestjs/common';
import { PauseDto } from './dto/pause.dto';
import { DBService } from '../../common/db.service';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';

@Injectable()
export class SettingsService extends DBService {
  async pause(pauseDto: PauseDto) {
    await this.db
      .update(users)
      .set({
        pauseUntil: new Date(pauseDto.timestamp),
        isLive: false
      })
      .where(eq(users.deviceToken, this.token));
  }

  async unpause() {
    await this.db
      .update(users)
      .set({
        pauseUntil: null
      })
      .where(eq(users.deviceToken, this.token));
  }
}
