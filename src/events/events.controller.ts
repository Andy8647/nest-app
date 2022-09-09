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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ListEvents } from './filter/list.events';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';

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

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  create(
    @Body()
    createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.createEvent(createEventDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.update(id, updateEventDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser() user: User,
  ) {
    const result = await this.eventsService.remove(id, user);
    if (result.affected !== 1) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
  }
}
