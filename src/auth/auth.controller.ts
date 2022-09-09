import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthGuardJwt } from './auth-guard.jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
