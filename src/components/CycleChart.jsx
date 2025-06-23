import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function CycleChart({
  type = "line",
  data = [],
  width = "100%",
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  title = "",
  dataKey = "value",
  xAxisKey = "name",
  color = "#8b5cf6",
  gradient = false,
}) {
  // Sample data for different chart types if no data provided
  const sampleData = {
    cycleTrend: [
      { month: "Jan", cycleLength: 28, periodLength: 5 },
      { month: "Feb", cycleLength: 30, periodLength: 4 },
      { month: "Mar", cycleLength: 28, periodLength: 5 },
      { month: "Apr", cycleLength: 29, periodLength: 6 },
      { month: "May", cycleLength: 27, periodLength: 4 },
      { month: "Jun", cycleLength: 28, periodLength: 5 },
    ],
    symptoms: [
      { name: "Cramps", value: 65, color: "#ef4444" },
      { name: "Mood Swings", value: 45, color: "#f59e0b" },
      { name: "Bloating", value: 55, color: "#8b5cf6" },
      { name: "Headache", value: 30, color: "#ec4899" },
      { name: "Fatigue", value: 70, color: "#06b6d4" },
    ],
    flowIntensity: [
      { day: "Day 1", flow: 4 },
      { day: "Day 2", flow: 5 },
      { day: "Day 3", flow: 4 },
      { day: "Day 4", flow: 3 },
      { day: "Day 5", flow: 2 },
      { day: "Day 6", flow: 1 },
    ],
  };

  const chartData = data.length > 0 ? data : sampleData.cycleTrend;

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Gradient definitions
  const renderGradientDefs = () => (
    <defs>
      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
      </linearGradient>
    </defs>
  );

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            )}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#d1d5db"
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#d1d5db" />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: "#fff" }}
            />
            {chartData[0]?.periodLength && (
              <Line
                type="monotone"
                dataKey="periodLength"
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#ec4899", strokeWidth: 2, r: 3 }}
              />
            )}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={chartData}>
            {renderGradientDefs()}
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            )}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#d1d5db"
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#d1d5db" />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={gradient ? "url(#purpleGradient)" : color}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            )}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              stroke="#d1d5db"
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#d1d5db" />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "pie": {
        const pieData = data.length > 0 ? data : sampleData.symptoms;
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={height / 3}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || color} />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
          </PieChart>
        );
      }

      default:
        return (
          <div className="text-center text-gray-500">
            Unsupported chart type
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}
      <ResponsiveContainer width={width} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

// Pre-configured chart components for common use cases
export const CycleTrendChart = (props) => (
  <CycleChart
    type="line"
    dataKey="cycleLength"
    xAxisKey="month"
    title="Cycle Length Trend"
    showLegend={true}
    color="#8b5cf6"
    {...props}
  />
);

export const FlowIntensityChart = (props) => (
  <CycleChart
    type="bar"
    dataKey="flow"
    xAxisKey="day"
    title="Flow Intensity"
    color="#ec4899"
    {...props}
  />
);

export const SymptomsChart = (props) => (
  <CycleChart
    type="pie"
    title="Symptoms Distribution"
    height={250}
    showTooltip={true}
    {...props}
  />
);

export const CycleOverviewChart = (props) => (
  <CycleChart
    type="area"
    dataKey="cycleLength"
    xAxisKey="month"
    title="Cycle Overview"
    gradient={true}
    color="#8b5cf6"
    {...props}
  />
);

export default CycleChart;
