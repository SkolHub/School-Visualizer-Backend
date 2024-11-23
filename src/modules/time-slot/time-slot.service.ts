import { Injectable } from '@nestjs/common';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { DBService } from '../../common/db.service';
import { timeSlot } from '../../database/schema/time-slot';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class TimeSlotService extends DBService {
  async create(createTimeSlotDto: CreateTimeSlotDto) {
    await this.db.insert(timeSlot).values({
      time: createTimeSlotDto.time,
      deviceToken: this.token,
      name: createTimeSlotDto.name,
      repeatAfter: createTimeSlotDto.repeatAfter
    });
  }

  async update(updateTimeSlotDto: UpdateTimeSlotDto, id: number) {
    await this.db
      .update(timeSlot)
      .set({
        time: updateTimeSlotDto.time,
        name: updateTimeSlotDto.name,
        repeatAfter: updateTimeSlotDto.repeatAfter
      })
      .where(and(eq(timeSlot.id, id), eq(timeSlot.deviceToken, this.token)));
  }

  async remove(id: number) {
    await this.db
      .delete(timeSlot)
      .where(and(eq(timeSlot.id, id), eq(timeSlot.deviceToken, this.token)));
  }
}
