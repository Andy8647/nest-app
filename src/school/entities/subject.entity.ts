import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { JoinTable } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects, { cascade: true })
  @JoinTable()
  teachers: Teacher[];
}
