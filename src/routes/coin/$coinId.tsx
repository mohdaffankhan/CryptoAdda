import CoinChart from "@/components/CoinChart";
import { formatDollar, formatChange } from "@/lib/formatters";
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
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/Bookmark";

export const Route = createFileRoute("/coin/$coinId")({
  component: CoinDetailPage,
});

function CoinDetailPage() {
  const { coinId } = useParams({ from: "/coin/$coinId" });
  const { loading, coinData, getCoinData, isRefreshing, refreshAll } = useCryptoStore();

  useEffect(() => {
    getCoinData(coinId);
  }, [coinId, getCoinData]);

  const handleRefresh = () => {
    refreshAll();
  };

  if (loading || !coinData) {
    return (
      <div className="p-6 space-y-6 min-h-screen bg-background">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border bg-card">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border bg-card h-[400px]">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  const latestPrice = coinData.prices.at(-1)?.[1] || 0;
  const previousPrice = coinData.prices.at(-24)?.[1] || 0;
  const priceChange = previousPrice 
    ? ((latestPrice - previousPrice) / previousPrice) * 100 
    : 0;
  const latestMarketCap = coinData.market_caps.at(-1)?.[1] || 0;
  const latestVolume = coinData.total_volumes.at(-1)?.[1] || 0;

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen bg-background">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold capitalize text-foreground">
            {coinId}
          </h1>
          <span
            className={`px-2 py-1 text-xs md:text-sm rounded-full flex items-center gap-1 ${
              priceChange >= 0
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
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
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
          <BookmarkButton coinId={coinId} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4" />
            <p className="text-sm">Price</p>
          </div>
          <p className="font-semibold text-xl text-foreground">
            {formatDollar(latestPrice)}
          </p>
          <p
            className={`text-xs mt-1 ${
              priceChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {priceChange >= 0 ? "↑" : "↓"} {formatChange(priceChange)}
          </p>
        </div>

        <div className="p-4 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Layers className="w-4 h-4" />
            <p className="text-sm">Market Cap</p>
          </div>
          <p className="font-semibold text-xl text-foreground">
            {formatDollar(latestMarketCap)}
          </p>
        </div>

        <div className="p-4 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart2 className="w-4 h-4" />
            <p className="text-sm">24h Volume</p>
          </div>
          <p className="font-semibold text-xl text-foreground">
            {formatDollar(latestVolume)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-lg font-medium text-foreground">Price Chart</h2>
        </div>
        <div className="p-4 bg-card rounded-xl border shadow-sm h-[400px]">
          {coinData?.prices && (
            <div className="w-full h-full min-h-[300px]">
              <CoinChart 
                prices={coinData.prices} 
                loading={isRefreshing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}