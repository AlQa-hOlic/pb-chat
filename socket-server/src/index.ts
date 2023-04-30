import config from "./config";
import { logger } from "./logger";
import { createSocketServer } from "./socketServer";

createSocketServer()
  .then((server) => {
    server.listen(config.PORT);
    logger.info(`Server started at port ${config.PORT}`);
  })
  .catch((error) => {
    logger.error("Server failed to start", { error });
  });
