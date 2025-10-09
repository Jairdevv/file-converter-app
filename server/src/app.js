import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.js";
import helmet from "helmet";
import compression from "compression";
import { FRONTEND_URL } from "./config/zamzar.js";
import logger from "./config/logger.js";

const app = express();

morgan.token("user-agent", (req) => req.headers["user-agent"]);
morgan.token("ip", (req) => req.ip);

//consola
app.use(
  morgan(":ip :method :url :status :user-agent - :response-time ms", {
    stream: {
      write: (message) => {
        logger.info(message.trim()); // Winston guarda en archivos
      },
    },
  })
);

app.use(helmet());
app.use(cors({ origin: FRONTEND_URL }));
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

export default app;
