import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';

@Injectable()
export class ScheduleService extends DBService {
  findOne(deviceToken: string) {}

  create(createScheduleDto: CreateScheduleDto, deviceToken: string) {}

  remove(deviceToken: string) {}
}
