import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
config;

import { NODE_ENV, PORT } from '@/config';
import { logger } from '@/utils/logger';
import routes from '@/routes';

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan('dev'));

server.use('/api', routes);

server.listen(PORT, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${NODE_ENV} =======`);
    logger.info(`🚀 App listening on the port ${PORT}`);
    logger.info(`=================================`);
});
