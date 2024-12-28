import { RouterModule, Routes } from '@nestjs/core';
import { TimetableModule } from '../modules/timetable/timetable.module';
import { AuthModule } from '../modules/auth/auth.module';
import { KeepAliveModule } from '../modules/keep-alive/keep-alive.module';
import { SettingsModule } from '../modules/settings/settings.module';

const routes: Routes = [
  {
    path: 'timetable',
    module: TimetableModule
  },
  {
    path: 'auth',
    module: AuthModule
  },
  {
    path: 'ping',
    module: KeepAliveModule
  },
  {
    path: 'settings',
    module: SettingsModule
  }
];

export const AppRoutesModule = RouterModule.register(routes);
