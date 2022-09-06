import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ListEvents } from './filter/list.events';

@ApiTags('events')
@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @Inject(EventsService) private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    return await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        currentPage: filter.page,
        limit: filter.limit,
        total: true,
      },
    );
  }

  @Get('practice')
  async practice() {
    return await this.eventsService.practice();
  }

  @Get('practice2')
  async practice2() {
    return await this.eventsService.practice2();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(
    @Body()
    createEventDto: CreateEventDto,
  ) {
    console.log('in create: ', createEventDto.address.length);
    return this.eventsService.create(createEventDto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    updateEventDto: UpdateEventDto,
  ) {
    console.log('in update: ', updateEventDto.address.length);
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    const result = await this.eventsService.remove(id);
    if (result.affected !== 1) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
  }
}
