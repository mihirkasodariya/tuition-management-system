const helmet = require("helmet");

const helmetConfig = helmet({
  xPoweredBy: false,
});

module.exports = helmetConfig;
