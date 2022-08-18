import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(
    @Inject(EventsService) private readonly eventsService: EventsService,
  ) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Post()
  create() {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
