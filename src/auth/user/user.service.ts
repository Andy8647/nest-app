import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  private findOneByUserName(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  private findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  public async createUser(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.retypedPassword) {
      this.logger.warn('Password mismatch');
      throw new BadRequestException(['Passwords are not identical']);
    }
    // check if user already exists with the same username or email
    const userWithSameUsername = await this.findOneByUserName(
      createUserDto.username,
    );
    if (userWithSameUsername) {
      this.logger.warn(
        `User with username ${createUserDto.username} already exists`,
      );
      throw new BadRequestException([
        `Username ${createUserDto.username} already exists`,
      ]);
    }
    const userWithSameEmail = await this.findOneByEmail(createUserDto.email);
    if (userWithSameEmail) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);
      throw new BadRequestException([
        `Email ${createUserDto.email} already exists`,
      ]);
    }

    this.logger.debug(`User to be created: ${JSON.stringify(createUserDto)}`);

    // if not, create the user
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
