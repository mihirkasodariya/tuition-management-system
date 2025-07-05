const dotenv = require("dotenv");
//   env load
dotenv.config();

module.exports = {
  SERVER_PORT: process.env.PORT || 8001,
  DEVELOPMENT_MODE: process.env.DEVELOPMENT_MODE || "development",
  DEVELOPMENT_ACCESS_USER_TOKEN:
    process.env.DEVELOPMENT_ACCESS_USER_TOKEN || null,

  // mongodb
  DEVELOPMENT_MONGODB_URL: process.env.DB_URL_DEV,
  PRODUCTION_MONGODB_URL: process.env.DB_URL,

  // redis
  REDIS_URL: process.env.REDIS_URL,
  REDIS_URL_DEV: process.env.REDIS_URL_DEV,

  // token keys
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_KEY_TIME: process.env.ACCESS_TOKEN_KEY_TIME,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  // cors
  CORS_ALLOW_ORIGINS: process.env.ALLOW_ORIGINS_ACCESS,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY: process.env.CLOUDINARY_API_SECRET_KEY,

  // Google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_CALL_BACK_URL,

  // Aws SES credentials
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_SES_SENDER: process.env.AWS_SES_SENDER,

  // nodemailer
  NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,

  // admin id
  USER_ACCOUNT_ID: process.env.USER_ACCOUNT_ID || "672493276aa409505ecd9b43",

  // open router api key
  OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY,
};
