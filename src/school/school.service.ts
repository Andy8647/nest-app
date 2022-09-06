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
    const subject = await this.subjectRepository.findOne(3);

    const teacher1 = await this.teacherRepository.findOne(3);
    const teacher2 = await this.teacherRepository.findOne(4);

    return await this.subjectRepository
      .createQueryBuilder()
      .relation(Subject, 'teachers')
      .of(subject)
      .add([teacher1, teacher2]);
  }

  public async removeRelation() {
    // const subject = await this.subjectRepository.findOne(1, {
    //   relations: ['teachers'],
    // });
    // subject.teachers = subject.teachers.filter((teacher) => teacher.id !== 1);
    //
    // await this.subjectRepository.save(subject);
    await this.subjectRepository
      .createQueryBuilder('s')
      .update()
      .set({ name: 'Confidential' })
      .execute();
  }
}
