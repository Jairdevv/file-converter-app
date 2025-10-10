import { FileText } from 'lucide-react';
import { useFileConversion } from '../hooks/useFileConversion'
import FileUpload from '../components/FileUpload';
import FormatSelector from '../components/FormatSelector';
import ProgressBar from '../components/ProgressBar';
import StatusMessage from '../components/StatusMessage';
import ActionButtons from '../components/ActionButtons';

const FileConverter = () => {
  const { file, handleFileChange, targetFormat, setTargetFormat, status, progress, errorMessage, handleConvert, handleDownload, resetConverter } = useFileConversion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4'>
              <FileText className='h-8 w-8 text-indigo-500' />
            </div>
            <h1 className='text-3xl text-gray-700 font-bold'>Convertidor de Archivos</h1>
            <p className='text-gray-600 mt-2'>Convierte tus archivos fácilmente entre diferentes formatos</p>
          </div>
          <FileUpload file={file} onFileChange={handleFileChange} disabled={status === 'uploading' || status === 'converting'} />
          <FormatSelector targetFormat={targetFormat} setTargetFormat={setTargetFormat} status={status} />
          <ProgressBar progress={progress} visible={status === 'uploading' || status === 'converting'} />
          <StatusMessage errorMessage={errorMessage} status={status} />
          <ActionButtons status={status} handleDownload={handleDownload} resetConverter={resetConverter} handleConvert={handleConvert} file={file} />
          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Hecho con ❤️ usando Zamzar API - Manejo de archivos y conversiones
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileConverter
