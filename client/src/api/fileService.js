import { api } from "./axiosInstance.js";

export const startConversion = async (file, targetFormat) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("targetFormat", targetFormat);

  const { data } = await api.post("/convert", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return { jobId: data.jobId };
};

export const getJobStatus = async (jobId) => {
  const { data } = await api.get(`/job/${jobId}`);
  const fileId = data.targetFileId;
  return {
    status: data.status,
    downloadUrl: fileId ? `${api.defaults.baseURL}/download/${fileId}` : null,
  };
};
