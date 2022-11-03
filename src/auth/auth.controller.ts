import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller, UseGuards, Post, Req } from '@nestjs/common';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return await this.authService.createToken(req.user);
  }
}
