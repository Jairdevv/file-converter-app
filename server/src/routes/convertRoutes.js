import { Router } from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  convertFile,
  getJobStatus,
  downloadFile,
} from "../controllers/convertController.js";

const router = Router();

router.post("/convert", upload.single("file"), convertFile);
router.get("/job/:jobId", getJobStatus);
router.get("/download/:fileId", downloadFile);

export default router;
