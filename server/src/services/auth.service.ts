import { PrismaClient, User } from '@prisma/client';

class AuthService {
  private readonly prisma: PrismaClient;

  protected constructor() {
    this.prisma = new PrismaClient();
  }

  public async login(email: string, password: string): Promise<User | null> {
    // TODO: Implement login here
    const user = await this.prisma.user.findUnique({ where: { email } });
    password = 'pass';

    return user;
  }
}

export default AuthService;
