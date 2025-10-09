import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import { ZAMZAR_API_KEY, ZAMZAR_BASE_URL } from "../config/zamzar.js";
import logger from "../config/logger.js";

export const convertFile = async (req, res) => {
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }
    filePath = req.file.path;
    logger.info(`Solicitud de conversión recibida: ${req.file?.originalname}`);

    if (!ZAMZAR_API_KEY) {
      return res
        .status(500)
        .json({ error: "API Key de Zamzar no configurada" });
    }

    const { targetFormat } = req.body;
    if (!targetFormat) {
      return res.status(400).json({ error: "Debe indicar un targetFormat" });
    }

    const sourceFormat = path.extname(req.file.originalname).substring(1);
    if (!sourceFormat) {
      return res
        .status(400)
        .json({ error: "No se pudo detectar el formato de origen" });
    }

    const formData = new FormData();
    formData.append("source_file", fs.createReadStream(filePath));
    formData.append("target_format", targetFormat);
    formData.append("source_format", sourceFormat);

    const response = await axios.post(`${ZAMZAR_BASE_URL}/jobs`, formData, {
      auth: { username: ZAMZAR_API_KEY, password: "" },
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(filePath);
    const jobId = response.data.id;

    res.json({
      success: true,
      jobId,
      status: response.data.status,
      message: "Conversión iniciada exitosamente",
    });
  } catch (error) {
    logger.error(`Error en conversión: ${error.message}`);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({
      error: "Conversion failed",
      details: error.response?.data || error.message,
    });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const response = await axios.get(`${ZAMZAR_BASE_URL}/jobs/${jobId}`, {
      auth: { username: ZAMZAR_API_KEY, password: "" },
    });
    logger.info(`Servidor buscando el jobId: ${jobId}`);
    res.json({
      success: true,
      status: response.data.status,
      targetFileId: response.data.target_files?.[0]?.id,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al verificar estado",
      details: error.response?.data || error.message,
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const fileInfo = await axios.get(`${ZAMZAR_BASE_URL}/files/${fileId}`, {
      auth: { username: ZAMZAR_API_KEY, password: "" },
    });

    const fileStream = await axios.get(
      `${ZAMZAR_BASE_URL}/files/${fileId}/content`,
      {
        auth: { username: ZAMZAR_API_KEY, password: "" },
        responseType: "stream",
      }
    );

    res.setHeader(
      "Content-Type",
      fileInfo.data.mime_type || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileInfo.data.name}"`
    );
    fileStream.data.pipe(res);
  } catch (error) {
    res.status(500).json({
      error: "Error al descargar archivo",
      details: error.response?.data || error.message,
    });
  }
};
