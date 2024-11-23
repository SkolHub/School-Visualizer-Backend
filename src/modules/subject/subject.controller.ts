import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Patch(':name')
  update(@Body() updateSubjectDto: UpdateSubjectDto, @Param() name: string) {
    return this.subjectService.update(updateSubjectDto, name);
  }

  @Delete(':name')
  remove(@Param() name: string) {
    return this.subjectService.remove(name);
  }
}
