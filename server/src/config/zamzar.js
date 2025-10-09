import dotenv from "dotenv";
dotenv.config();

export const ZAMZAR_API_KEY = process.env.ZAMZAR_API_KEY;
export const ZAMZAR_BASE_URL =
  process.env.ZAMZAR_BASE_URL || "https://api.zamzar.com/v1";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
