import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(user) {
    const payload = { sub: user.id, email: user.email };

    return {
      user: {
        ...user,
        password: undefined,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async validate(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!compareSync(password, user.password))
      throw new HttpException(
        'Email/Senha incorretos',
        HttpStatus.UNAUTHORIZED,
      );

    return user;
  }
}
