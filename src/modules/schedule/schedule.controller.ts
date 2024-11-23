import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get(':deviceToken')
  findOne(@Param() deviceToken: string) {
    return this.scheduleService.findOne(deviceToken);
  }

  @Post(':deviceToken')
  create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Param() deviceToken: string
  ) {
    return this.scheduleService.create(createScheduleDto, deviceToken);
  }

  @Delete(':deviceToken')
  remove(@Param() deviceToken: string) {
    return this.scheduleService.remove(deviceToken);
  }
}
