import { Body, Controller, Delete, Post } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Controller()
export class TimetableController {
  constructor(private readonly scheduleService: TimetableService) {}

  @Post()
  create(@Body() createScheduleDto: CreateTimetableDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Delete()
  delete() {
    return this.scheduleService.delete();
  }
}
