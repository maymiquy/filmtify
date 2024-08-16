import { Request, Response, NextFunction } from 'express';
import AuthService from '@/services/auth.service';
import { CreateLoginDto } from '@/dto/login.dto';
import { CreateRegisterDto } from '@/dto/register.dto';

class AuthController {
  public authService = new AuthService();

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateRegisterDto = req.body;
      const user = await this.authService.register(data);
      res.status(201).json({
        data: {
          email: user.email,
          username: user.username
        },
        message: 'Successfully register'
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateLoginDto = req.body;
      const { cookie, user } = await this.authService.login(data);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        data: {
          email: user.email,
          username: user.username
        },
        message: 'Successfully Login'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
