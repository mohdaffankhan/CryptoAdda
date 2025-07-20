import {
  LineChart,
  lineElementClasses,
  markElementClasses,
  axisClasses,
} from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";

type CoinChartData = {
  id: string;
  name: string;
  prices: [timestamp: number, price: number][];
};

const COLORS = [
  "#00bcd4", "#ff9800", "#4caf50", "#e91e63", "#9c27b0", "#f44336", "#3f51b5"
];

const formatPrice = (value: number): string => {
  if (value >= 1_00_00_000) return `$${(value / 1_00_00_000).toFixed(1)}Cr`;
  if (value >= 1_00_000) return `$${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

export default function MultiCoinChart({ coins }: { coins: CoinChartData[] }) {
  const theme = useTheme();

  if (coins.length === 0) return null;

  const timestamps = coins[0].prices.map(([ts]) => new Date(ts));

  return (
    <div className="w-full h-full min-h-[300px]">
      <LineChart
        height={400}
        margin={{ top: 40, right: 30, left: 30, bottom: 50 }}
        sx={{
          width: "100%",
          height: "100%",
          [`.${axisClasses.root}`]: {
            stroke: theme.palette.mode === "dark" ? "#aaa" : "#555",
            [`.${axisClasses.tickLabel}`]: {
              fill: theme.palette.mode === "dark" ? "#aaa" : "#555",
              fontSize: "0.75rem",
            },
            [`.${axisClasses.label}`]: {
              fill: theme.palette.mode === "dark" ? "#fff" : "#222",
              fontSize: "0.875rem",
            },
          },
          [`.${lineElementClasses.root}`]: {
            strokeWidth: 2,
          },
          [`.${markElementClasses.root}`]: {
            display: "none",
          },
          "& .MuiChartsLegend-root text": {
            fill: theme.palette.mode === "dark" ? "#fff" : "#222",
            fontSize: "0.875rem",
          },
        }}
        xAxis={[
          {
            data: timestamps,
            scaleType: "time",
            valueFormatter: (value: Date) =>
              new Intl.DateTimeFormat("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
              }).format(value),
          },
        ]}
        yAxis={[
          {
            valueFormatter: formatPrice,
            label: "Price (USD)",
          },
        ]}
        series={coins.map((coin, idx) => ({
          data: coin.prices.map(([, price]) => price),
          label: coin.name,
          color: COLORS[idx % COLORS.length],
        }))}
      />
    </div>
  );
}
