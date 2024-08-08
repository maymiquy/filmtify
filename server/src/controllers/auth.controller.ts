import { Request, Response, NextFunction } from 'express';
import AuthService from '@/services/auth.service';
import { CreateLoginDto } from '@/dto/login.dto';

class AuthController {
  public authService = new AuthService();

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateLoginDto = req.body;
      const { cookie, user } = await this.authService.login(data);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: user, message: 'Successfully Login' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
