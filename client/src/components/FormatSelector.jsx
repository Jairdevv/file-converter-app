import formats from '../utils/formats'

const FormatSelector = ({ targetFormat, setTargetFormat, status }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Formato de destino
      </label>
      <select
        value={targetFormat}
        onChange={(e) => setTargetFormat(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        disabled={status !== 'idle' && status !== 'successful'}
      >
        {formats.map((format) => (
          <option key={format.value} value={format.value}>
            {format.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FormatSelector
