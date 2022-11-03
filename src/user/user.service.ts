import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    };

    if (
      await this.db.user.findFirst({
        where: {
          email: createUserDto.email,
        },
      })
    )
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    const newUser = await this.db.user.create({
      data,
    });

    return {
      ...newUser,
      password: undefined,
    };
  }

  async findAll() {
    return await this.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user)
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = {
      ...updateUserDto,
      password: await hash(updateUserDto.password, 10),
    };

    const userUpdated = await this.db.user.update({
      where: {
        id,
      },
      data,
    });

    return {
      ...userUpdated,
      password: undefined,
    };
  }

  async remove(id: string) {
    return await this.db.user.delete({
      where: {
        id,
      },
    });
  }
}
