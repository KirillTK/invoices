export const BarChartSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-end space-x-1">
            <div className="w-10 bg-gray-200 rounded">
              <div style={{height: `${Math.floor(Math.random() * 101)}%`}} className="bg-blue-200 rounded"></div>
            </div>
            <div className="flex-grow h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
