import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DBService } from '../../common/db.service';
import { timeSlot } from '../../database/schema/time-slot';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class SubjectService extends DBService {
  async create(createSubjectDto: CreateSubjectDto) {
    await this.db.insert(timeSlot).values(
      createSubjectDto.timeSlots.map((timeslot) => ({
        time: timeslot.time,
        deviceToken: this.token,
        name: createSubjectDto.name,
        repeatAfter: timeslot.repeatAfter
      }))
    );
  }

  async update(updateSubjectDto: UpdateSubjectDto, name: string) {
    await this.db
      .update(timeSlot)
      .set({
        name: updateSubjectDto.name
      })
      .where(
        and(eq(timeSlot.name, name), eq(timeSlot.deviceToken, this.token))
      );
  }

  async remove(name: string) {
    await this.db
      .delete(timeSlot)
      .where(
        and(eq(timeSlot.name, name), eq(timeSlot.deviceToken, this.token))
      );
  }
}
