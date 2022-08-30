import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    @Inject(EventsService) private readonly eventsService: EventsService,
  ) {}

  @Get()
  findAll(@Query() query: any) {
    return this.eventsService.findAll();
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
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.eventsService.remove(id);
  }
}
