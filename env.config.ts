import { config } from 'dotenv';

config();

export default process.env as {
  DB_URL: string;
};
