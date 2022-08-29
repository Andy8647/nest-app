import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  public async findAll(): Promise<Event[]> {
    return await this.eventRepository.find({});
  }

  public async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
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

  public async create(createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventRepository.save(createEventDto);
  }

  public async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return await this.eventRepository.save({ ...event, ...updateEventDto });
  }

  public async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    await this.eventRepository.remove(event);
  }
}
