import { IsISO8601 } from 'class-validator';

export class PauseDto {
  @IsISO8601()
  timestamp: string;
}
