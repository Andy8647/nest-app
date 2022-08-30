import { IsDateString, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'The name of the event',
    example: 'Birthday party',
  })
  @IsString()
  @Length(5, 255, { message: 'Name must be between 5 and 255 characters' })
  name: string;

  @ApiProperty({
    description: 'The description of the event',
    example: 'A birthday party for my wife',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The date of the event',
    example: '2022-01-05T13:15:30Z',
  })
  @IsDateString()
  when: string;

  @ApiProperty({
    description: 'The address of the event',
    example: '123 Main St',
  })
  @Length(5, 255)
  @IsString()
  address: string;
}
