// Server entry point
import app from "./src/app";
import { logger } from "./src/utils/logger";
import { PORT } from "./src/utils/constants";

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
