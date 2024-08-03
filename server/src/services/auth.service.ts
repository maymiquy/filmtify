import { PrismaClient, User } from '@prisma/client';

class AuthService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async login(email: string, password: string): Promise<User | null> {
        // TODO: Implement login here
        let user;

        return user;
    }
}

export default AuthService;
