import { Module } from '@nestjs/common';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AppRoutesModule } from './config/app-routes.module';
import { DatabaseModule } from './config/database.module';
import { SubjectModule } from './modules/subject/subject.module';
import { TimeSlotModule } from './modules/time-slot/time-slot.module';

@Module({
  imports: [
    AppRoutesModule,
    DatabaseModule,
    ScheduleModule,
    SubjectModule,
    TimeSlotModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
