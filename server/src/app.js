import express from "express";
import cors from "cors";
import { FRONTEND_URL } from "./config/zamzar.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(routes);

export default app;
