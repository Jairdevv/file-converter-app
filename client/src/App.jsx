import React, { useState } from 'react';
import { Upload, FileText, Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function FileConverter() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [status, setStatus] = useState('idle'); // idle, uploading, converting, completed, error
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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

      if (!response.ok) {
        throw new Error('Error en la conversión');
      }

      const data = await response.json();

      setStatus('converting');

      // Simular polling del estado de conversión
      // En producción, implementarías un polling real a Zamzar
      setTimeout(() => {
        setStatus('completed');
        setDownloadUrl(data.downloadUrl || '#');
      }, 3000);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Error al convertir el archivo');
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={status === 'uploading' || status === 'converting'}
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
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

          {status === 'completed' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-700">
                ¡Conversión completada exitosamente!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {status === 'completed' ? (
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
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
              Esta aplicación usa la API de Zamzar para convertir archivos.
              Asegúrate de tener una API key válida configurada en el backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}