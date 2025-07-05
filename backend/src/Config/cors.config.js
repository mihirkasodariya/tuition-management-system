const { CORS_ALLOW_ORIGINS } = require("./index.config");
const cors = require("cors");

const corsOptions = {
  origin: JSON.parse(CORS_ALLOW_ORIGINS),
  credentials: true,
};

const corsConfig = cors(corsOptions);
module.exports = corsConfig;
