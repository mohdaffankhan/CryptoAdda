import {
  LineChart,
  lineElementClasses,
  markElementClasses,
  axisClasses,
} from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

const formatPrice = (value: number): string => {
  if (value >= 1_00_00_000) return `$${(value / 1_00_00_000).toFixed(1)}Cr`;
  if (value >= 1_00_000) return `$${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

const CoinChart = ({ prices }: { prices: [number, number][] }) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    return prices.map(([timestamp, price]) => ({
      time: new Date(timestamp),
      price,
    }));
  }, [prices]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <LineChart
        margin={{ top: 40, right: 30, left: 30, bottom: 50 }} // Increased top margin for legend
        height={ 300 }
        sx={{
          width: '100%',
          maxWidth: '100%',
          [`.${axisClasses.root}`]: {
            stroke: theme.palette.mode === "dark" ? "#aaa" : "#555",
            [`.${axisClasses.tickLabel}`]: {
              fill: theme.palette.mode === "dark" ? "#aaa" : "#555",
              fontSize: '0.75rem',
            },
            [`.${axisClasses.label}`]: {
              fill: theme.palette.mode === "dark" ? "#fff" : "#222",
              fontSize: '0.875rem',
            },
          },
          [`.${lineElementClasses.root}`]: {
            strokeWidth: 2,
            stroke: theme.palette.mode === "dark" ? "#00bcd4" : "#0066cc",
          },
          [`.${markElementClasses.root}`]: {
            display: "none",
          },
          // Legend styles
          '& .MuiChartsLegend-root text': {
            fill: theme.palette.mode === "dark" ? "#fff" : "#222",
            fontSize: '0.875rem',
          },
          '& .MuiChartsLegend-root line': {
            stroke: theme.palette.mode === "dark" ? "#00bcd4" : "#0066cc",
          }
        }}
        xAxis={[
          {
            data: chartData.map((p) => p.time),
            scaleType: "time",
            valueFormatter: (value: Date) =>
              new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(value),
          },
        ]}
        yAxis={[
          {
            valueFormatter: (value: number) => formatPrice(value),
            label: "USD",
            labelStyle: {
              fill: theme.palette.mode === "dark" ? "#fff" : "#222",
              fontSize: '0.875rem',
            },
          },
        ]}
        series={[
          {
            data: chartData.map((p) => p.price),
            label: "Price",
            color: theme.palette.mode === "dark" ? "#00bcd4" : "#0066cc",
          },
        ]}
        slotProps={{
          legend: {
          },
        }}
      />
    </div>
  );
};

export default CoinChart;