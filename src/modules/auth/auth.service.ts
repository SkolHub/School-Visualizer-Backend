import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { UploadTokenDto } from './dto/upload-token.dto';
import { users } from '../../database/schema/users';

@Injectable()
export class AuthService extends DBService {
  async startToken(uploadTokenDto: UploadTokenDto) {
    await this.db
      .insert(users)
      .values({
        startToken: uploadTokenDto.token,
        deviceToken: this.token
      })
      .onConflictDoUpdate({
        target: [users.deviceToken],
        set: {
          startToken: uploadTokenDto.token
        }
      });
  }

  async updateToken(uploadTokenDto: UploadTokenDto) {
    await this.db
      .insert(users)
      .values({
        updateToken: uploadTokenDto.token,
        deviceToken: this.token
      })
      .onConflictDoUpdate({
        target: [users.deviceToken],
        set: {
          updateToken: uploadTokenDto.token
        }
      });
  }
}
