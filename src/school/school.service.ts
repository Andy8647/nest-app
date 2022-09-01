import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  public async saveRelation() {
    const subject = new Subject();
    subject.name = 'Math';

    const teacher1 = new Teacher();
    teacher1.name = 'teacher1';

    const teacher2 = new Teacher();
    teacher2.name = 'teacher2';

    subject.teachers = [teacher1, teacher2];

    await this.subjectRepository.save(subject);
  }

  public async removeRelation() {
    const subject = await this.subjectRepository.findOne(1, {
      relations: ['teachers'],
    });
    subject.teachers = subject.teachers.filter((teacher) => teacher.id !== 1);

    await this.subjectRepository.save(subject);
  }
}
