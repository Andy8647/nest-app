import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee, EAttendeeAnswer } from './entities/attendee.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAcceptedCount',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: EAttendeeAnswer.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybeCount',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: EAttendeeAnswer.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejectedCount',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: EAttendeeAnswer.Rejected,
          }),
      );
  }

  public async findAll(): Promise<Event[]> {
    this.logger.log('findAll');
    const events = await this.eventRepository.find({});
    this.logger.debug(`found ${events.length} events`);
    return events;
  }

  public async findOne(id: number): Promise<Event> {
    // const event = await this.eventRepository.findOne(id);
    // if (!event) {
    //   throw new NotFoundException(`Event with id ${id} not found`);
    // }
    // return event;
    const query = await this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      {
        id,
      },
    );
    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public async practice(): Promise<Event[]> {
    return await this.eventRepository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2019-01-13T12:00:00')),
        },
        {
          description: Like('%birthday%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }

  public async practice2(): Promise<Event[]> {
    // // return await this.eventRepository.findOne(1, { relations: ['attendees'] });
    // const event = await this.eventRepository.findOne(1, {
    //   relations: ['attendees'],
    // });
    //
    // const attendee = new Attendee();
    // attendee.name = 'Use Cascade';
    // // attendee.event = event;
    //
    // event.attendees.push(attendee);
    //
    // // await this.attendeeRepository.save(attendee);
    // await this.eventRepository.save(event);
    //
    // return event;
    return await this.getEventsWithAttendeeCountQuery().getMany();
  }

  public async create(createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventRepository.save(createEventDto);
  }

  public async update(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return await this.eventRepository.save({ ...event, ...updateEventDto });
  }

  public async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    await this.eventRepository.remove(event);
  }
}
