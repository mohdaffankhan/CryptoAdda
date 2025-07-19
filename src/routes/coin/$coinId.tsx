import CoinChart from "@/components/CoinChart";
import { formatDollar } from "@/lib/formatters";
import { useCryptoStore } from "@/store/useCryptoStore";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  BarChart2,
  DollarSign,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/coin/$coinId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { coinId } = useParams({ from: "/coin/$coinId" });
  const { loading, coinData, getCoinData } = useCryptoStore();

  useEffect(() => {
    getCoinData(coinId);
  }, [coinId]);

  if (loading || !coinData)
    return (
      <div className="p-6 space-y-6 dark:bg-black min-h-screen">
        <Skeleton className="h-8 w-48 dark:bg-gray-800" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl dark:bg-gray-800" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl dark:bg-gray-800" />
      </div>
    );

  const latestPrice = coinData.prices.at(-1)?.[1] || 0;
  const previousPrice = coinData.prices.at(-24)?.[1] || 0;
  const priceChange =
    latestPrice && previousPrice
      ? ((latestPrice - previousPrice) / previousPrice) * 100
      : 0;
  const latestMarketCap = coinData.market_caps.at(-1)?.[1] || 0;
  const latestVolume = coinData.total_volumes.at(-1)?.[1] || 0;

  return (
    <div className="p-4 md:p-6 space-y-6 dark:bg-black min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold capitalize text-gray-900 dark:text-white">
          {coinId}
        </h1>
        <span
          className={`px-2 py-1 text-xs md:text-sm rounded-full flex items-center gap-1 ${
            priceChange >= 0
              ? "bg-green-900/20 text-green-600 dark:text-green-300"
              : "bg-red-900/20 text-red-600 dark:text-red-300"
          }`}
        >
          {priceChange >= 0 ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )}
          {Math.abs(priceChange).toFixed(2)}%
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <p className="text-sm">Price</p>
          </div>
          <p className="font-semibold text-xl dark:text-white">
            {formatDollar(latestPrice)}
          </p>
          <p
            className={`text-xs mt-1 ${
              priceChange >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {priceChange >= 0 ? "↑" : "↓"}{" "}
            {formatDollar(Math.abs(latestPrice - (previousPrice || 0)))} (
            {priceChange.toFixed(2)}%)
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Layers className="w-4 h-4" />
            <p className="text-sm">Market Cap</p>
          </div>
          <p className="font-semibold text-xl dark:text-white">
            {formatDollar(latestMarketCap)}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <BarChart2 className="w-4 h-4" />
            <p className="text-sm">24h Volume</p>
          </div>
          <p className="font-semibold text-xl dark:text-white">
            {formatDollar(latestVolume)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-lg font-medium dark:text-white">Price Chart</h2>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 h-[400px]">
          {coinData?.prices && (
            <div className="w-full h-full min-h-[300px]">
              <CoinChart prices={coinData.prices} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
