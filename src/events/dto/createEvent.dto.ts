import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'The name of the event',
    example: 'Birthday party',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the event',
    example: 'A birthday party for my wife',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The date of the event', example: '2020-01-01' })
  @IsDate()
  when: Date;

  @ApiProperty({
    description: 'The address of the event',
    example: '123 Main St',
  })
  @IsString()
  address: string;
}
