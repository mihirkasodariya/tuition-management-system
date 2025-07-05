const app = require("./app");
const logger = require("./src/Config/logger.config");
const { SERVER_PORT, DEVELOPMENT_MODE } = require("./src/Config/index.config");

function startServer() {
  app.listen(SERVER_PORT, () => {
    console.log("Server Mode : ", DEVELOPMENT_MODE);
    console.log("server is started", SERVER_PORT);
    logger.info(`Server Mode : ${DEVELOPMENT_MODE}`);
    logger.info(`Server is running on  : http://localhost:${SERVER_PORT}`);
    console.log(`Server is running on  : http://localhost:${SERVER_PORT}`);
  });
}

startServer();
