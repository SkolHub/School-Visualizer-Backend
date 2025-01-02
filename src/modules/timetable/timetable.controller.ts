import { Body, Controller, Delete, Post } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Controller()
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  create(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetableService.create(createTimetableDto);
  }

  @Delete()
  delete() {
    return this.timetableService.delete();
  }
}
