import path from "path";

const ALLOWED_EXTENSIONS = process.env.ALLOWED_FILE_TYPES.split(",") || [
  "pdf",
  "docx",
  "xlsx",
  "png",
  "jpg",
  "jpeg",
  "mp4",
  "mp3",
];

const MAX_FILE_SIZE = (process.env.MAX_FILE_SIZE || 1) * 1024 * 1024;

const MIME_TYPE_MAP = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
};

export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push("No se proporcionó ningún archivo");
    return { isValid: false, errors };
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(
      `Te pasaste del tamaño del archivo cojuo, el tamaño maximo es ${
        MAX_FILE_SIZE / (1024 * 1024)
      } MB`
    );
  }

  const ext = path.extname(file.originalname).substring(1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    errors.push(
      `Tipo de archivo no permitido. Solo se permiten: ${ALLOWED_EXTENSIONS.join(
        ", "
      )}`
    );
  }

  const expectedMimeType = MIME_TYPE_MAP[ext];

  if (expectedMimeType && file.mimetype !== expectedMimeType) {
    errors.push("El tipo MIME del archivo no coincide con su extensión");
  }

  return {
    isValid: errors.length === 0,
    errors,
    extension: ext,
  };
};

export const validateTargetFormat = (targetFormat) => {
  if (!targetFormat) {
    return { isValid: false, error: "Formato de destino no especificado" };
  }

  if (!ALLOWED_EXTENSIONS.includes(targetFormat.toLowerCase())) {
    return { isValid: false, error: "Formato de destino no válido" };
  }

  return { isValid: true };
};
