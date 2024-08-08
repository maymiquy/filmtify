import { SECRET_KEY } from '@/config';
import { CreateLoginDto } from '@/dto/login.dto';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  private readonly prisma: PrismaClient;

  public constructor() {
    this.prisma = new PrismaClient();
  }

  public async login(
    loginDto: CreateLoginDto
  ): Promise<{ cookie: string; user: User }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email }
      });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const passwordIsValid = await bcrypt.compare(
        loginDto.password,
        user.password
      );

      if (!passwordIsValid) {
        throw new Error('Invalid email or password');
      }

      const expire = 36000;
      const token = jwt.sign({ email: user.email }, SECRET_KEY, {
        expiresIn: expire
      });
      const cookie = `Authorization=${token}; HttpOnly; Max-Age=${360000}`;

      return { cookie, user };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export default AuthService;
