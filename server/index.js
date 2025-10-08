import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173" || process.env.FRONTEND_URL,
  })
);
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1 * 1024 * 1024 },
});

const ZAMZAR_API_KEY = process.env.ZAMZAR_API_KEY;
const ZAMZAR_BASE_URL = "https://api.zamzar.com/v1";

app.post("/api/convert", upload.single("file"), async (req, res) => {
  let filePath;
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }
    filePath = req.file.path;

    if (!ZAMZAR_API_KEY) {
      return res.status(500).json({
        error: "API Key de Zamzar no configurada",
      });
    }

    const { targetFormat } = req.body;
    if (!targetFormat) {
      return res.status(400).json({ error: "Debe indicar un targetFormat" });
    }
    const filePath = req.file.path;

    const sourceFormat = path.extname(req.file.originalname).substring(1);
    if (!sourceFormat) {
      return res
        .status(400)
        .json({ error: "No se pudo detectar el formato de origen" });
    }

    console.log(
      `Iniciando conversión: ${req.file.originalname} (${sourceFormat}) -> ${targetFormat}`
    );

    const formData = new FormData();
    formData.append("source_file", fs.createReadStream(filePath));
    formData.append("target_format", targetFormat);
    formData.append("source_format", sourceFormat);

    const response = await axios.post(`${ZAMZAR_BASE_URL}/jobs`, formData, {
      auth: {
        username: ZAMZAR_API_KEY,
        password: "",
      },
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(filePath);

    const jobId = response.data.id;

    console.log(`Job creado exitosamente: ${jobId}`);

    res.json({
      success: true,
      jobId: jobId,
      status: response.data.status,
      message: "Conversión iniciada exitosamente",
    });
  } catch (error) {
    console.error(
      "Error en conversión:",
      error.response?.data || error.message
    );

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }

    res.status(500).json({
      error: "Conversion failed",
      details: error.response?.data || error.message,
    });
  }
});

app.get("/api/job/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const response = await axios.get(`${ZAMZAR_BASE_URL}/jobs/${jobId}`, {
      auth: {
        username: ZAMZAR_API_KEY,
        password: "",
      },
    });

    res.json({
      success: true,
      status: response.data.status,
      targetFileId: response.data.target_files?.[0]?.id,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error al verificar job:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Error al verificar estado",
      details: error.response?.data || error.message,
    });
  }
});

// Endpoint para descargar archivo convertido
app.get("/api/download/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    // Obtener información del archivo
    const fileInfo = await axios.get(`${ZAMZAR_BASE_URL}/files/${fileId}`, {
      auth: {
        username: ZAMZAR_API_KEY,
        password: "",
      },
    });

    // Descargar el archivo
    const fileStream = await axios.get(
      `${ZAMZAR_BASE_URL}/files/${fileId}/content`,
      {
        auth: {
          username: ZAMZAR_API_KEY,
          password: "",
        },
        responseType: "stream",
      }
    );

    // Configurar headers para descarga
    res.setHeader(
      "Content-Type",
      fileInfo.data.mime_type || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileInfo.data.name || `file_${fileId}`}"` // nombre seguro
    );

    fileStream.data.pipe(res);
  } catch (error) {
    console.error(
      "Error al descargar archivo:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Error al descargar archivo",
      details: error.response?.data || error.message,
    });
  }
});

// Endpoint de salud
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    zamzarConfigured: !!ZAMZAR_API_KEY,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
