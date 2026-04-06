import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client.mjs';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      // Generate the password hash
      const hash = await argon.hash(dto.password);

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
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // Compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // If password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    // Send back the user
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
  }
}
