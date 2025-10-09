import app from "./app.js";
import dotenv from "dotenv";
import logger from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  logger.info(`Servidor corriendo en puerto ${PORT} (${process.env.NODE_ENV})`)
);
