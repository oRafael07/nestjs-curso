import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validate(email, password);

    if (!user)
      throw new HttpException(
        'Email/Senha são invalidos',
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }
}
