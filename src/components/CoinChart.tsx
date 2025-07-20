import {
  LineChart,
  type LineSeriesType,
  lineElementClasses,
  markElementClasses,
  axisClasses,
} from "@mui/x-charts";
import { useTheme } from "@/components/theme-provider"; // Your Tailwind theme provider
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CoinChartProps {
  prices: [number, number][];
  loading?: boolean;
  height?: number;
  showLegend?: boolean;
}

const formatPrice = (value: number): string => {
  if (value >= 1_00_00_000) return `$${(value / 1_00_00_000).toFixed(1)}Cr`;
  if (value >= 1_00_000) return `$${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

const CoinChart = ({ 
  prices, 
  loading = false, 
  height = 300
}: CoinChartProps) => {
  const { theme } = useTheme();

  const chartData = useMemo(
    () =>
      prices.map(([timestamp, price]) => ({
        time: new Date(timestamp),
        price,
      })),
    [prices]
  );

  const currentTheme = theme === 'system' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme;

  const isDark = currentTheme === 'dark';
  
  // Color definitions
  const textColor = isDark ? "#e5e7eb" : "#4b5563";
  const labelColor = isDark ? "#f9fafb" : "#111827";
  const lineColor = isDark ? "#60a5fa" : "#3b82f6";
  const gridColor = isDark ? "rgba(229, 231, 235, 0.1)" : "rgba(75, 85, 99, 0.1)";
  const legendColor = isDark ? "#f3f4f6" : "#1f2937";

  if (loading) {
    return <Skeleton className="w-full" style={{ height: `${height}px` }} />;
  }

  if (!prices || prices.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-muted-foreground" 
        style={{ height: `${height}px` }}
      >
        No price data available
      </div>
    );
  }

  const series: LineSeriesType = {
    type: 'line',
    data: chartData.map((d) => d.price),
    label: 'Price',
    color: lineColor,
    showMark: false,
    valueFormatter: (value) => formatPrice(value as number),
  };

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <LineChart
        height={height}
        margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
        xAxis={[
          {
            data: chartData.map((d) => d.time),
            scaleType: "time",
            valueFormatter: (date: Date) =>
              new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(date),
            tickLabelStyle: {
              fill: textColor,
              fontSize: "0.75rem",
            },
          },
        ]}
        yAxis={[
          {
            valueFormatter: formatPrice,
            label: "Price (USD)",
            labelStyle: {
              fill: labelColor,
              fontSize: "0.875rem",
              fontWeight: 500,
            },
            tickLabelStyle: {
              fill: textColor,
              fontSize: "0.75rem",
            },
          },
        ]}
        series={[series]}
        grid={{
          vertical: false,
          horizontal: true,
        }}
        colors={[lineColor]}
        slotProps={{
        }}
        sx={{
          // Fix for the center price legend
          '& .MuiChartsAxis-tickLabel': {
            fill: `${textColor} !important`,
          },
          '& .MuiChartsAxis-label': {
            fill: `${labelColor} !important`,
          },
          // Axis styling
          [`& .${axisClasses.root}`]: {
            [`& .${axisClasses.line}`]: {
              stroke: gridColor,
              strokeWidth: 1,
            },
          },
          // Line styling
          [`& .${lineElementClasses.root}`]: {
            strokeWidth: 2,
            stroke: lineColor,
          },
          // Hide marks
          [`& .${markElementClasses.root}`]: {
            display: "none",
          },
          // Legend styling
          '& .MuiChartsLegend-root': {
            '& .MuiChartsLegend-series': {
              '& text': {
                fill: `${legendColor} !important`,
              },
              '& line': {
                stroke: `${lineColor} !important`,
                strokeWidth: 2,
              },
            },
          },
          // Grid lines
          '& .MuiChartsAxis-grid': {
            stroke: gridColor,
            strokeDasharray: '3 3',
          },
        }}
      />
    </div>
  );
};

export default CoinChart;