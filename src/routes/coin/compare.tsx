import { MultiSelectCombobox } from "@/components/Combobox";
import { formatDollar, formatChange } from "@/lib/formatters";
import { useCryptoStore } from "@/store/useCryptoStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import CoinChart from "@/components/CoinChart";
import { TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/coin/compare")({
  component: ComparePage,
});

function ComparePage() {
  const { 
    marketData, 
    getMarketData, 
    getMultiCoinData, 
    loading, 
    isRefreshing,
    refreshAll 
  } = useCryptoStore();
  
  const [selected, setSelected] = useState<string[]>([]);
  const [chartCoins, setChartCoins] = useState<
    { id: string; name: string; prices: [number, number][] }[]
  >([]);
  const [isFetchingCharts, setIsFetchingCharts] = useState(false);

  useEffect(() => {
    getMarketData();
  }, [getMarketData]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (selected.length === 0) {
        setChartCoins([]);
        return;
      }

      setIsFetchingCharts(true);
      try {
        const data = await getMultiCoinData(selected);
        const coins = selected
          .map((coinId) => {
            const meta = marketData.find((c) => c.id === coinId);
            if (!meta || !data[coinId]) return null;
            return {
              id: coinId,
              name: meta.name,
              prices: data[coinId].prices,
            };
          })
          .filter(Boolean) as {
          id: string;
          name: string;
          prices: [number, number][];
        }[];

        setChartCoins(coins);
      } finally {
        setIsFetchingCharts(false);
      }
    };

    fetchChartData();
  }, [selected, marketData, getMultiCoinData]);

  const coinOptions = useMemo(
    () =>
      marketData.map((coin) => ({
        label: coin.name,
        value: coin.id,
        image: coin.image,
        symbol: coin.symbol.toUpperCase(),
        change: coin.price_change_percentage_24h,
      })),
    [marketData]
  );

  const comparedCoins = useMemo(
    () => marketData.filter((coin) => selected.includes(coin.id)),
    [marketData, selected]
  );

  const handleRefresh = () => {
    refreshAll();
  };

  if (loading && marketData.length === 0) {
    return (
      <div className="p-6 space-y-6 min-h-screen bg-background">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Compare Coins</h1>
          <p className="text-muted-foreground">
            Select up to 5 coins to compare performance
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </div>

      <div className="space-y-4">
        <MultiSelectCombobox
          options={coinOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Search coins..."
          maxSelected={5}
        />

        {comparedCoins.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Comparison Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-left">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-4">Coin</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">24h Change</th>
                    <th className="p-4">Market Cap</th>
                    <th className="p-4">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {comparedCoins.map((coin) => {
                    const change = coin.price_change_percentage_24h;
                    const isPositive = change >= 0;

                    return (
                      <tr
                        key={coin.id}
                        className="border-t border-muted/20 hover:bg-muted/10"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-6 h-6 rounded-full"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "/fallback-coin.png")
                              }
                            />
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {coin.symbol.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          {formatDollar(coin.current_price)}
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              isPositive
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            )}
                          >
                            {isPositive ? "+" : ""}
                            {formatChange(change)}
                          </span>
                        </td>
                        <td className="p-4">
                          {formatDollar(coin.market_cap)}
                        </td>
                        <td className="p-4">
                          {formatDollar(coin.total_volume)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>

      {selected.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price Charts
          </h2>
          
          {isFetchingCharts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(selected.length)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : chartCoins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartCoins.map((coin) => (
                <Card key={coin.id}>
                  <CardHeader>
                    <CardTitle className="text-center">
                      {coin.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <CoinChart prices={coin.prices} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No chart data available for selected coins
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}