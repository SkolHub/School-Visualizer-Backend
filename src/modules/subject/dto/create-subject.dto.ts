import {
  ArrayMinSize,
  IsInt,
  IsMilitaryTime,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class SubjectTimeSlotDto {
  @IsInt()
  @Min(1)
  @Max(31)
  repeatAfter: number;

  @IsString()
  @IsMilitaryTime()
  time: string;
}

export class CreateSubjectDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @ValidateNested({ each: true })
  @Type(() => SubjectTimeSlotDto)
  @ArrayMinSize(1)
  timeSlots: SubjectTimeSlotDto[];
}
