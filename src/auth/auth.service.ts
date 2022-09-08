import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  public getTokenForUser(user: User): string {
    this.logger.debug(`Generating token for user ${user.username}`);
    return this.jwtService.sign({ username: user.username, sub: user.id });
  }
}
