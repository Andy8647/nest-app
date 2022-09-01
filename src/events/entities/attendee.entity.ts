import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';

export enum EAttendeeAnswer {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees)
  @JoinColumn()
  event: Event;

  @Column('enum', { enum: EAttendeeAnswer, default: EAttendeeAnswer.Maybe })
  answer: EAttendeeAnswer;
}
