import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { timeSlot } from '../../database/schema/time-slot';
import { eq } from 'drizzle-orm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ScheduleService extends DBService {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  findOne() {
    return this.db
      .select({
        time: timeSlot.time,
        name: timeSlot.name,
        repeatAfter: timeSlot.repeatAfter
      })
      .from(timeSlot);
  }

  async create(createScheduleDto: CreateScheduleDto) {
    await this.db.insert(timeSlot).values(
      createScheduleDto.subjects
        .map((subject) =>
          subject.timeSlots.map((timeSlot) => ({
            time: timeSlot.time,
            name: subject.name,
            deviceToken: this.token,
            repeatAfter: timeSlot.repeatAfter
          }))
        )
        .flat()
    );
  }

  async remove() {
    await this.db.delete(timeSlot).where(eq(timeSlot.deviceToken, this.token));
  }
}
