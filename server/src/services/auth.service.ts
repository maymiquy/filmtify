import { JWT_SECRET_KEY, STRIPE_SECRET_KEY } from '@/config';
import { CreateLoginDto } from '@/dto/login.dto';
import { CreateRegisterDto } from '@/dto/register.dto';
import stripe from '@/lib/stripe';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  private readonly prisma: PrismaClient;

  public constructor() {
    this.prisma = new PrismaClient();
  }

  public async register(registerDto: CreateRegisterDto): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email }
      });

      if (existingUser) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const stripeCust = await stripe.customers.create(
        {
          email: registerDto.email
        },
        {
          apiKey: STRIPE_SECRET_KEY
        }
      );

      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          username: registerDto.username,
          password: hashedPassword,
          custId: stripeCust.id
        }
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
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
      const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, {
        expiresIn: expire
      });
      const cookie = `Authorization=${token}; HttpOnly; Max-Age=${360000}`;

      return { cookie, user };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default AuthService;
