import winston from "winston";
import path from "path";
import fs from "fs";

const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 🎨 Formato colorido para consola
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),

    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      format: fileFormat,
      level: "info",
    }),

    // ✅ Solo errores
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      format: fileFormat,
      level: "error",
    }),
  ],
});

export default logger;
