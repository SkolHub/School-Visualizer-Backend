import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { UploadTokenDto } from './dto/upload-token.dto';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService extends DBService {
  async deviceToken() {
    await this.db.insert(users).values({
      deviceToken: this.token,
      startToken: '',
      updateToken: ''
    });
  }

  async startToken(uploadTokenDto: UploadTokenDto) {
    await this.db
      .update(users)
      .set({
        startToken: uploadTokenDto.token
      })
      .where(eq(users.deviceToken, this.token));
  }

  async updateToken(uploadTokenDto: UploadTokenDto) {
    await this.db
      .update(users)
      .set({
        updateToken: uploadTokenDto.token
      })
      .where(eq(users.deviceToken, this.token));
  }
}
