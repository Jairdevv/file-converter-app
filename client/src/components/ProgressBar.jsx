
const ProgressBar = ({ progress }) => {
  return (
    <div className="flex items-center mt-4">
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
