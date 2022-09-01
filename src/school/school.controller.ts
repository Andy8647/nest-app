import { Controller, Inject, Post } from '@nestjs/common';
import { SchoolService } from './school.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('school')
@Controller('school')
export class SchoolController {
  constructor(
    @Inject(SchoolService) private readonly schoolService: SchoolService,
  ) {}

  @Post('/create')
  saveRelation() {
    return this.schoolService.saveRelation();
  }

  @Post('/remove')
  removeRelation() {
    return this.schoolService.removeRelation();
  }
}
