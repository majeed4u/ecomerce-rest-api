import { cleanEnv, str, port, num } from 'envalid';
import * as dotenv from 'dotenv';
dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URL: str(),
  JWT_SECRET: str(),
  JWT_LIFE: str(),
  STRIPE_KEY: str(),
  endpointSecret: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_SECRET_KEY: str(),
});

export default env;
