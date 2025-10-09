import React, { useEffect, useState } from 'react';
import { Upload, FileText, Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function FileConverter() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [status, setStatus] = useState('idle'); // idle, uploading, converting, successful, error
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);


  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'DOCX' },
    { value: 'xlsx', label: 'XLSX' },
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'mp4', label: 'MP4' },
    { value: 'mp3', label: 'MP3' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(e.target)
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('idle');
      setDownloadUrl(null);
      setErrorMessage('');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setErrorMessage('Por favor selecciona un archivo primero');
      return;
    }

    setStatus('uploading');
    setProgress(10);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    try {
      const response = await axios.post('http://localhost:3000/api/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      const jobId = data.jobId;
      setStatus('converting');
      setProgress(30)

      // Polling for job status
      const interval = setInterval(async () => {
        try {
          const jobResponse = await axios.get(`http://localhost:3000/api/job/${jobId}`);
          const jobData = jobResponse.data;

          setProgress((prev) => Math.min(prev + 10, 95));

          console.log('Job status:', jobData);

          if (jobData.status === 'successful') {
            clearInterval(interval);
            setIntervalId(null)

            const fileId = jobData.targetFileId;
            const downloadLink = `http://localhost:3000/api/download/${fileId}`;
            setDownloadUrl(downloadLink);
            setStatus('successful');
            setProgress(100)
          } else if (jobData.status === 'failed') {
            clearInterval(interval);
            setIntervalId(null)
            setStatus('error');
            setErrorMessage('La conversión del archivo falló');
          }

        } catch (jobError) {
          console.error('Error en el polling:', jobError);
          clearInterval(interval);
          setIntervalId(null)
          setStatus('error');
          setErrorMessage('Error al obtener el estado del trabajo');
        }
      }, 2000);

      setIntervalId(null)
    } catch (error) {
      console.error("Error en la conversión:", error);
      setStatus('error');
      setErrorMessage(error.response?.data?.details || 'Error al convertir el archivo');
    }
  };

  const handleDownload = () => {
    if (downloadUrl && downloadUrl !== '#') {
      window.open(downloadUrl, '_blank');
    }
  };

  const resetConverter = () => {
    setFile(null);
    setStatus('idle');
    setDownloadUrl(null);
    setErrorMessage('');
  };


  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Convertidor de Archivos
            </h1>
            <p className="text-gray-600">
              Convierte tus archivos a diferentes formatos fácilmente
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar archivo
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={status === 'uploading' || status === 'converting'}
              />
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Haz clic o arrastra un archivo aquí'}
                </p>
                {file && (
                  <p className="text-xs text-gray-500 mt-1">
                    Tamaño: {(file.size / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de destino
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              disabled={status === 'uploading' || status === 'converting'}
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          {/* Spinner animado */}
          {(status === "uploading" || status === "converting") && (
            <div className="flex items-center mt-4">
              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {status === 'converting' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-3" />
              <p className="text-sm text-blue-700">
                Convirtiendo archivo... esto puede tomar unos momentos
              </p>
            </div>
          )}

          {status === 'successful' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-700">
                ¡Conversión completada exitosamente!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {status === 'successful' ? (
              <>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar archivo
                </button>
                <button
                  onClick={resetConverter}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Nuevo
                </button>
              </>
            ) : (
              <button
                onClick={handleConvert}
                disabled={!file || status === 'uploading' || status === 'converting'}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {status === 'uploading' || status === 'converting' ? (
                  <>
                    {/* <Loader2 className="w-5 h-5 mr-2 animate-spin" /> */}
                    Procesando...
                  </>
                ) : (
                  'Convertir archivo'
                )}
              </button>
            )}
          </div>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Hecho con ❤️ usando Zamzar API - Manejo de archivos y conversiones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}