import { Router } from "express";
import convertRoutes from "./convertRoutes.js";

const router = Router();

router.use("/api", convertRoutes);
router.get("/health", (req, res) => res.json({ status: "OK" }));

export default router;
