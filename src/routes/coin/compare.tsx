import { MultiSelectCombobox } from "@/components/Combobox";
import { formatDollar } from "@/lib/formatters";
import { useCryptoStore } from "@/store/useCryptoStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import CoinChart from "@/components/CoinChart";

export const Route = createFileRoute("/coin/compare")({
  component: ComparePage,
});

function ComparePage() {
  const { marketData, getMarketData, getMultiCoinData, loading } =
    useCryptoStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [chartCoins, setChartCoins] = useState<
    { id: string; name: string; prices: [number, number][] }[]
  >([]);
  const [isFetchingCharts, setIsFetchingCharts] = useState(false);

  useEffect(() => {
    getMarketData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      if (selected.length === 0) {
        setChartCoins([]);
        return;
      }

      setIsFetchingCharts(true);
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
      setIsFetchingCharts(false);
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

  if (loading && marketData.length === 0) {
    return (
      <div className="p-6 space-y-6 dark:bg-black min-h-screen">
        <Skeleton className="h-8 w-48" />
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
    <div className="p-6 space-y-6 dark:bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold">Compare Coins</h1>

      <MultiSelectCombobox
        options={coinOptions}
        value={selected}
        onChange={setSelected}
        placeholder="Select coins to compare"
        maxSelected={5}
      />

      {comparedCoins.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-2">Coin</th>
                <th className="p-2">Price</th>
                <th className="p-2">Change (24h)</th>
                <th className="p-2">Market Cap</th>
                <th className="p-2">24h Volume</th>
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
                    <td className="p-2 flex items-center gap-2">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-5 h-5"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "/fallback-coin.png")
                        }
                      />
                      <span className="font-medium">
                        {coin.name}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({coin.symbol.toUpperCase()})
                        </span>
                      </span>
                    </td>
                    <td className="p-2">{formatDollar(coin.current_price)}</td>
                    <td className="p-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-sm font-medium",
                          isPositive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-2">{formatDollar(coin.market_cap)}</td>
                    <td className="p-2">{formatDollar(coin.total_volume)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Price Comparison</h2>
          {isFetchingCharts ? (
            <Skeleton className="w-full h-[400px]" />
          ) : chartCoins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {chartCoins.map((coin) => (
                <div key={coin.id} className="w-full max-w-full">
                  <h3 className="text-lg font-semibold mb-2 text-center">
                    {coin.name}
                  </h3>
                  <div className="bg-muted rounded-xl p-4">
                    <div className="h-[300px] sm:h-[350px] xl:h-[400px]">
                      <CoinChart prices={coin.prices} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No chart data available.</p>
          )}
        </div>
      )}
    </div>
  );
}
