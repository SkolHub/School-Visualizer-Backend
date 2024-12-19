import { RouterModule, Routes } from '@nestjs/core';
import { ScheduleModule } from '../modules/schedule/schedule.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { AuthModule } from '../modules/auth/auth.module';

const routes: Routes = [
  {
    path: 'schedule',
    module: ScheduleModule
  },
  {
    path: 'test',
    module: NotificationModule
  },
  {
    path: 'auth',
    module: AuthModule
  }
];

export const AppRoutesModule = RouterModule.register(routes);
