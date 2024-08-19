import express, { Application, Router } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
config();

import { LOG_FORMAT, NODE_ENV, PORT } from '@/config';
import { logger, stream } from '@/utils/logger';
import AuthRoute from '@/routes/auth.route';
import errorMiddleware from './middlewares/error.middleware';

interface Routes {
  path?: string;
  router: Router;
}

class Server {
  public server: Application;
  public env: string;
  public port: number;

  constructor(routes: Routes[]) {
    this.server = express();
    this.env = NODE_ENV;
    this.port = parseInt(PORT);

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.server;
  }

  private initializeMiddlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(morgan(LOG_FORMAT, { stream }));
    this.server.use(cors());
    this.server.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.server.use('/api', route.router);
    });
  }

  private initializeErrorHandling() {
    this.server.use(errorMiddleware);
  }
}

const server = new Server([new AuthRoute()]);
server.listen();
