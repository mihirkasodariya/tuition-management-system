const httpErrors = require("http-errors");
const { VerifyAccessToken } = require("../Utils/jwt.token");
const logger = require("../Config/logger.config");
const { USER_NOT_FOUND } = require("../Constants/user.constants");
const {
  AUTHENTICATION_TOKEN_REQUIRED,
  AUTHORIZATION_REQUIRED,
} = require("../Constants/auth.constants");
const { ADMIN } = require("../Constants/roles.constants");
const errorHandling = require("../Utils/errorHandling");
const {
  DEVELOPMENT_MODE,
  DEVELOPMENT_ACCESS_USER_TOKEN,
} = require("../Config/index.config");
const userModel = require("../Schema/users/user.model");
const RedisServiceClass = require("../Services/redis.service");
// for authentication
module.exports.Authentication = async (req, res, next) => {
  try {
    let authHeader = req.header("Authorization");
    if (DEVELOPMENT_MODE === "development" && req?.authToken) {
      authHeader = req.authToken;
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(httpErrors.Unauthorized(AUTHENTICATION_TOKEN_REQUIRED));
    }

    const token = authHeader.split(" ")[1];
    const decode = await VerifyAccessToken(token);
    if (!decode.success) {
      return next(httpErrors.Unauthorized(decode.error.message));
    }

    let userExist = null;

    const redisService = new RedisServiceClass();
    const cacheData = await redisService.getRedisJSON(decode.id);
    if (cacheData) {
      userExist = cacheData;
    }

    if (!cacheData) {
      userExist = await userModel.findById(decode.id).lean();
    }

    if (!userExist) {
      return next(httpErrors.NotFound(USER_NOT_FOUND));
    }
    req.user = userExist;
    req.__type__ = userExist?.role;
    logger.info(
      `req Email : ${userExist?.email || userExist?.name} role:${
        userExist.role
      }`
    );
    next();
  } catch (error) {
    errorHandling.handleCustomErrorService(error, next);
  }
};

// authorization depending  upon a role
module.exports.Authorization = (...roles) => {
  return (req, res, next) => {
    const userRole = req.__type__;
    if (!roles.includes(userRole)) {
      return next(httpErrors.Unauthorized(AUTHORIZATION_REQUIRED));
    }
    next();
  };
};

// setting headers for the development purpose
module.exports.setHeaderDevelopment = (req, res, next) => {
  let token = DEVELOPMENT_ACCESS_USER_TOKEN;
  req.authToken = token;
  next();
};
