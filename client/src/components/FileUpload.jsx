import { Upload } from 'lucide-react';

export const FileUpload = ({ file, onFileChange, disabled }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar archivo
      </label>
      <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-6 hover:border-indigo-500 transition-colors">
        <input
          type="file"
          onChange={(e) => onFileChange(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {file ? file.name : 'Haz clic o arrastra un archivo aquí'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
