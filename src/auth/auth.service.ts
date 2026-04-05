import { Injectable } from '@nestjs/common';
import { User, Bookmark } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = (await argon.hash(dto.password)).toString();

    console.log(hash);

    // Save the new user in the database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    console.log(user);

    // Return the saved user
    return user;
  }

  signin() {
    return { message: 'I am signed in from service' };
  }
}
