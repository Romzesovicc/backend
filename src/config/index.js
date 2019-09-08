import dotenv from 'dotenv';

const env = dotenv.config().parsed || process.env;

const config = {
  app: {
    env: env.env || 'development',
    port: env.port || 3005
  },
  mailer: {
    type: 'login',
    user: env.MAILER_USER,
    pass: env.MAILER_PASS,
    key: env.GMAIL_API_KEY
  }
};

export default config;
