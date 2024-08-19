import { JWT_SECRET_KEY, STRIPE_SECRET_KEY } from '@/config';
import { CreateLoginDto } from '@/dto/login.dto';
import { CreateRegisterDto } from '@/dto/register.dto';
import stripe from '@/lib/stripe';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { CreateOauthDto } from '@/dto/oauth.dto';

class AuthService {
  public prisma = new PrismaClient();

  public async regularRegister(registerDto: CreateRegisterDto): Promise<User> {
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

  public async regularLogin(
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

      const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, {
        expiresIn: 36000
      });
      const cookie = `Authorization=${token}; HttpOnly; Max-Age=${360000}`;

      return { cookie, user };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async oauthGoogle(
    oauthDto: CreateOauthDto
  ): Promise<{ cookie: string; user: User }> {
    try {
      const { accessToken } = oauthDto;
      const res = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.status !== 200) {
        throw new Error('Failed to fetch user data');
      }

      const { email, name } = await res.data;

      let user = await this.prisma.user.findUnique({
        where: {
          email
        }
      });

      if (!user) {
        const hashedPassword = await bcrypt.hash(email, 10);

        const stripeCust = await stripe.customers.create(
          {
            email
          },
          {
            apiKey: STRIPE_SECRET_KEY
          }
        );

        user = await this.prisma.user.create({
          data: {
            username: name,
            email: email,
            password: hashedPassword,
            custId: stripeCust.id
          }
        });

        const token = jwt.sign({ email: email }, JWT_SECRET_KEY, {
          expiresIn: 36000
        });
        const cookie = `Authorization=${token}; HttpOnly; Max-Age=${360000}`;

        return { cookie, user };
      }

      const token = jwt.sign({ email: email }, JWT_SECRET_KEY, {
        expiresIn: 36000
      });
      const cookie = `Authorization=${token}; HttpOnly; Max-Age=${360000}`;

      return { cookie, user };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default AuthService;
