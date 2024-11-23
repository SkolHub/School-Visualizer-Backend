import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';

@Controller()
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post()
  create(@Body() createTimeSlotDto: CreateTimeSlotDto) {
    return this.timeSlotService.create(createTimeSlotDto);
  }

  @Patch(':id')
  update(@Body() updateTimeSlotDto: UpdateTimeSlotDto, @Param() id: string) {
    return this.timeSlotService.update(updateTimeSlotDto, +id);
  }

  @Delete(':id')
  remove(@Param() id: string) {
    return this.timeSlotService.remove(+id);
  }
}
