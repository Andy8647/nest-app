import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request) {
    return {
      userId: request.user.id,
      token: this.authService.getTokenForUser(request.user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() request) {
    return request.user;
  }
}
