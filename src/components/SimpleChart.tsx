import React from "react";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  type: "bar" | "line" | "pie";
  title?: string;
  height?: number;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  type,
  title,
  height = 200,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  const renderBarChart = () => {
    return (
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t-lg transition-all duration-1000 ease-out relative group"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: color,
                  minHeight: "4px",
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.value}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => {
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (item.value / maxValue) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="relative h-full">
        <svg width="100%" height="100%" className="absolute inset-0">
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            points={points}
            className="animate-pulse"
            style={{
              strokeDasharray: "1000",
              strokeDashoffset: "1000",
              animation: "dash 2s ease-in-out forwards",
            }}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="#3B82F6"
                className="animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            );
          })}
        </svg>

        <div className="flex justify-between absolute bottom-0 left-0 right-0">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-gray-600 text-center">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let accumulatedPercentage = 0;

    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 4.4} 440`;
              const strokeDashoffset = -accumulatedPercentage * 4.4;
              const color =
                item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

              accumulatedPercentage += percentage;

              return (
                <circle
                  key={index}
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={color}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        <div className="ml-6 space-y-2">
          {data.map((item, index) => {
            const percentage = Math.round((item.value / total) * 100);
            const color =
              item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

            return (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm text-gray-700">
                  {item.label}: {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}

      <div style={{ height: `${height}px` }} className="relative">
        {type === "bar" && renderBarChart()}
        {type === "line" && renderLineChart()}
        {type === "pie" && renderPieChart()}
      </div>
    </div>
  );
};

export default SimpleChart;
