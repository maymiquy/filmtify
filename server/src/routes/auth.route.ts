import AuthController from '@/controllers/auth.controller';
import { CreateLoginDto } from '@/dto/login.dto';
import { CreateRegisterDto } from '@/dto/register.dto';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class AuthRoute {
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.iniatializeRoutes();
  }

  private iniatializeRoutes() {
    this.router.post(
      '/login',
      validationMiddleware(CreateLoginDto, 'body'),
      this.authController.login
    );

    this.router.post(
      '/register',
      validationMiddleware(CreateRegisterDto, 'body'),
      this.authController.register
    );
  }
}

export default AuthRoute;
