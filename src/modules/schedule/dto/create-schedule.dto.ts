import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubjectDto } from '../../subject/dto/create-subject.dto';

export class CreateScheduleDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSubjectDto)
  @ArrayMinSize(1)
  subjects: CreateSubjectDto[];
}
