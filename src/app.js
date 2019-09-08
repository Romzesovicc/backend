import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import config from './config';
import { getLogger, AVAILABLE_COLORS } from './services/logger';
import { sendEmail } from './services/mailer';

const appLogger = getLogger('app');
const httpLogger = getLogger('http', AVAILABLE_COLORS.MAGENTA);

process.on('unhandledRejection', error => {
  appLogger.error(error);
  appLogger.debug('%o', error);
});

const initApp = () => {
  appLogger.info('Initializing app...');
  let app = express();
  // use helmet and cors middlewares as simple security
  app.use(helmet());
  app.use(cors());
  // parse application/x-www-form-urlencoded and application/json content types
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json());
  // Logging all requests before setting routers
  app.use((req, res, next) => {
    httpLogger.info(`${req.method} ${req.url}`);
    next();
  });

  app.post('/mail', (req, res) => {
    console.log(req.body);
    sendEmail({
      from: req.body.email,
      name: req.body.fullname,
      subject: 'Новый Заказ',
      text: `
        Город: ${req.body.city},
        Телефон: ${req.body.phone},
        Объем: ${req.body.amount},
        Комментарий: ${req.body.comment},
        Рассылка: ${req.body.news}
      `
    })
      .then(() => res.status(200).json({ message: 'success' }))
      .catch((err) => {
        console.log(err);
        res.status(421).json({ message: 'error' });
      });
  });

  // error handling
  app.use((err, req, res, next) => {
    appLogger.debug(err);

    res.status(err.status || 500).json({
      statusCode: err.status || 500,
      error: err.name,
      message: err.message,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'No such route',
    });
  });

  return app;
};


if (!module.parent) { // Don't allow child process spawning
  const app = initApp();
  app.listen(config.app.port, () => {
    appLogger.info(`App is ready for use. Port: ${config.app.port}; PID: ${process.pid}`);
  });
}