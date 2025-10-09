import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
});

export default upload;
