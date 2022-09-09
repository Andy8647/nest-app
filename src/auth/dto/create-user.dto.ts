import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'Username' })
  @IsString()
  @Length(5)
  username: string;

  @ApiProperty({ type: String, description: 'Password' })
  @Length(8)
  password: string;

  @ApiProperty({ description: 'must be identical to password' })
  @Length(8)
  retypedPassword: string;

  @ApiProperty()
  @Length(2)
  firstName: string;

  @ApiProperty()
  @Length(2)
  lastName: string;

  @ApiProperty({
    description: 'must be a valid email address',
    examples: ['aaa@aa.com', 'bbb@bb.cn'],
  })
  @IsEmail()
  email: string;
}
