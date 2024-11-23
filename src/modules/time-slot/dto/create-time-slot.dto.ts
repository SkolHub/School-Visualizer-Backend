import {
  IsInt,
  IsMilitaryTime,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator';

export class CreateTimeSlotDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsInt()
  @Min(1)
  @Max(31)
  repeatAfter: number;

  @IsString()
  @IsMilitaryTime()
  time: string;
}
