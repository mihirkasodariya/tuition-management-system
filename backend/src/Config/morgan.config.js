const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const morganFormat = {
  COMBINE: "combined",
  TINY: "tiny",
  DEV: "dev",
  SHORT: "short",
  COMMON: "common",
};

const morganConfigFunction = () => {
  const morganFilePath = fs.createWriteStream(
    path.join(__dirname, "../../", "app-http.log"),
    {
      flags: "a",
    }
  );
  const morganConfig = morgan(morganFormat.COMBINE, { stream: morganFilePath });
  return morganConfig;
};

module.exports = morganConfigFunction;
