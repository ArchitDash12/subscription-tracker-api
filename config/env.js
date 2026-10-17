import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    NODE_ENV = 'development',
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_TOKEN,
    QSTASH_URL,
    SERVER_URL,
    EMAIL_PASSWORD
} = process.env;

export const PORT = process.env.PORT || 5500;
