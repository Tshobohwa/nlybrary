import { Injectable } from '@nestjs/common';
import { User, Bookmark } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    return { message: 'I am signed up from service' };
  }

  signin() {
    return { message: 'I am signed in from service' };
  }
}
