const { CORS_ALLOW_ORIGINS } = require("./index.config");

module.exports = {
  origin: JSON.parse(CORS_ALLOW_ORIGINS),
  credentials: true,
};
