import { Download } from 'lucide-react'

const ActionButtons = ({ status, handleDownload, resetConverter, handleConvert, file }) => {
  return (
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
  )
}

export default ActionButtons
