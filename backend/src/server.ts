// Server entry point
import app from "./app";
import { log } from "./utils/logger";
import { PORT } from "./utils/constants";

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}`);
});
