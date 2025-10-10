import { CheckCircle, Loader2, XCircle } from 'lucide-react'

const StatusMessage = ({ errorMessage, status }) => {
  return (
    <>
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
    </>
  )
}

export default StatusMessage
