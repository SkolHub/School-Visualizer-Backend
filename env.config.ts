import { config } from 'dotenv';

config();

export default process.env as {
  DB_URL: string;

  TEAM_ID: string;
  KEY_ID: string;
  AUTH_KEY: string;

  REDIS_PORT: string;
  REDIS_HOST: string
};
