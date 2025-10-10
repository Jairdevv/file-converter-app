import { useState, useEffect } from "react";
import { startConversion, getJobStatus } from "../api/fileService.js";

export const useFileConversion = () => {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("pdf");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [intervalId, setIntervalId] = useState(null);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setStatus("idle");
    setDownloadUrl(null);
    setErrorMessage("");
  };

  const handleConvert = async () => {
    if (!file) {
      setErrorMessage("Por favor selecciona un archivo");
      return;
    }

    setStatus("uploading");
    setProgress(10);
    setErrorMessage("");

    try {
      const { jobId } = await startConversion(file, targetFormat);
      setStatus("converting");
      setProgress(30);

      const interval = setInterval(async () => {
        try {
          const jobData = await getJobStatus(jobId);
          setProgress((prev) => Math.min(prev + 10, 95));

          if (jobData.status === "successful") {
            clearInterval(interval);
            setIntervalId(null);
            setDownloadUrl(jobData.downloadUrl);
            setStatus("successful");
            setProgress(100);
          } else if (jobData.status === "failed") {
            clearInterval(interval);
            setStatus("error");
            setErrorMessage("La conversión falló");
          }
        } catch {
          clearInterval(interval);
          setStatus("error");
          setErrorMessage("Error verificando el estado del trabajo");
        }
      }, 2000);
      setIntervalId(interval);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || "Error en la conversión");
    }
  };

  const handleDownload = () => {
    if (downloadUrl && downloadUrl !== "#") {
      window.open(downloadUrl, "_blank");
    }
  };

  const resetConverter = () => {
    setFile(null);
    setStatus("idle");
    setDownloadUrl(null);
    setErrorMessage("");
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return {
    file,
    targetFormat,
    status,
    progress,
    downloadUrl,
    errorMessage,
    handleFileChange,
    handleConvert,
    handleDownload,
    resetConverter,
    setTargetFormat,
    setFile,
    setStatus,
  };
};
