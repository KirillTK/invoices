export const BarChartSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative h-[400px]">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-right text-sm text-gray-400">
          {[5000, 4000, 3000, 2000, 1000, 0].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-8 ml-auto"></div>
          ))}
        </div>
        {/* Chart area */}
        <div className="ml-12 h-full flex items-end">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end items-center">
              <div className="w-full max-w-[40px] bg-blue-200 rounded-t" style={{height: `${Math.random() * 80 + 10}px`}}></div>
              <div className="h-4 w-full max-w-[40px] bg-gray-200 rounded mt-2"></div>
            </div>
          ))}
        </div>
        {/* X-axis line */}
        <div className="absolute bottom-0 left-12 right-0 h-[1px] bg-gray-200"></div>
      </div>
    </div>
  )
}
