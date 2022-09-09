import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee, EAttendeeAnswer } from './entities/attendee.entity';
import { EWhenEventFilter, ListEvents } from './filter/list.events';
import {
  paginate,
  PaginateOptions,
  PaginateResult,
} from '../common/pagination/paginator';
import { User } from '../user/entities/user.entity';

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

  private getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }
    if (filter.when) {
      if (filter.when == EWhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }
      if (filter.when == EWhenEventFilter.Tomorrow) {
        query = query.andWhere(`e.when >= CurDate() + INTERVAL 1 DAY`);
      }
      if (filter.when == EWhenEventFilter.ThisWeek) {
        query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`);
      }
      if (filter.when == EWhenEventFilter.NextWeek) {
        query = query.andWhere(
          `YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1`,
        );
      }
    }
    this.logger.debug(query.getSql());
    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  public async findAll(): Promise<Event[]> {
    this.logger.log('findAll');
    const events = await this.eventRepository.find({});
    this.logger.debug(`found ${events.length} events`);
    return events;
  }

  public async findOne(id: number): Promise<Event> {
    const query = await this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      {
        id,
      },
    );
    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public async createEvent(
    createEventDto: CreateEventDto,
    user: User,
  ): Promise<Event> {
    return await this.eventRepository.save({
      ...createEventDto,
      organizer: user,
      when: new Date(createEventDto.when),
    });
  }

  public async update(
    id: number,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to update this event`,
      );
    }
    return await this.eventRepository.save({ ...event, ...updateEventDto });
  }

  public async remove(id: number, user: User) {
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to delete this event`,
      );
    }
    return await this.eventRepository.delete(id);
  }
}
