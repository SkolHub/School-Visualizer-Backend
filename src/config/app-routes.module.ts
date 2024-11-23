import { RouterModule, Routes } from '@nestjs/core';
import { ScheduleModule } from '../modules/schedule/schedule.module';
import { SubjectModule } from '../modules/subject/subject.module';
import { TimeSlotModule } from '../modules/time-slot/time-slot.module';
import { NotificationModule } from '../modules/notification/notification.module';

const routes: Routes = [
  {
    path: 'schedule',
    module: ScheduleModule
  },
  {
    path: 'subject',
    module: SubjectModule
  },
  {
    path: 'time-slot',
    module: TimeSlotModule
  },
  {
    path: 'test',
    module: NotificationModule
  }
];

export const AppRoutesModule = RouterModule.register(routes);
