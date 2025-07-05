const { rateLimit } = require("express-rate-limit");

const ratelimitConfig = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 150,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

module.exports = ratelimitConfig;
