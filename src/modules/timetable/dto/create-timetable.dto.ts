import {
  ArrayMinSize,
  IsDateString,
  IsInt,
  IsString,
  Length,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class SubjectTimeSlotDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsInt()
  weekday: number;
}

class CreateSubjectDto {
  @IsString()
  @Length(1, 50)
  displayName: string;

  @IsString()
  @Length(1, 50)
  color: string;

  @IsString()
  @Length(1, 50)
  symbolName: string;

  @ValidateNested({ each: true })
  @Type(() => SubjectTimeSlotDto)
  timeSlots: SubjectTimeSlotDto[];
}

export class CreateTimetableDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSubjectDto)
  @ArrayMinSize(1)
  subjects: CreateSubjectDto[];
}
