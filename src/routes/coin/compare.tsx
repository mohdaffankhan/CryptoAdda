import { MultiSelectCombobox } from '@/components/Combobox';
import { formatDollar } from '@/lib/formatters';
import { useCryptoStore } from '@/store/useCryptoStore';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import MultiCoinChart from '@/components/MultiCoinChart';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/coin/compare')({
  component: ComparePage,
});

function ComparePage() {
  const { marketData, getMarketData, getCoinData, loading } = useCryptoStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [chartData, setChartData] = useState<Record<string, { prices: [number, number][], name: string }>>({});
  const [isFetchingCharts, setIsFetchingCharts] = useState(false);

  // Fetch initial market data
  useEffect(() => {
    getMarketData();
  }, []);

  // Fetch chart data when selected coins change
  useEffect(() => {
    const fetchSelectedCoinsData = async () => {
      if (selected.length === 0) {
        setChartData({});
        return;
      }

      setIsFetchingCharts(true);
      
      try {
        const newChartData: typeof chartData = {};
        
        await Promise.all(selected.map(async (coinId) => {
          // Only fetch if we don't already have this coin's data
          if (!chartData[coinId]) {
            const data = await getCoinData(coinId);
            const coin = marketData.find(c => c.id === coinId);
            if (data && coin) {
              newChartData[coinId] = {
                prices: data.prices,
                name: coin.name
              };
            }
          }
        }));

        setChartData(prev => ({
          ...prev,
          ...newChartData
        }));
      } finally {
        setIsFetchingCharts(false);
      }
    };

    fetchSelectedCoinsData();
  }, [selected]);

  const coinOptions = useMemo(
    () => marketData.map(coin => ({
      label: coin.name,
      value: coin.id,
      icon: coin.image
    })),
    [marketData]
  );

  const comparedCoins = useMemo(
    () => marketData.filter(coin => selected.includes(coin.id)),
    [marketData, selected]
  );

  const chartCoins = useMemo(
    () => selected
      .map(coinId => ({
        id: coinId,
        name: chartData[coinId]?.name || coinId,
        prices: chartData[coinId]?.prices || []
      }))
      .filter(coin => coin.prices.length > 0), // Only include coins with price data
    [selected, chartData]
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
        maxSelected={5} // Limit number of coins to compare
      />

      {comparedCoins.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse mt-4">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-2">Coin</th>
                <th className="p-2">Price</th>
                <th className="p-2">Market Cap</th>
                <th className="p-2">24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {comparedCoins.map((coin) => (
                <tr key={coin.id} className="border-t border-muted/20 hover:bg-muted/10">
                  <td className="p-2 flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                    {coin.name}
                  </td>
                  <td className="p-2">{formatDollar(coin.current_price)}</td>
                  <td className="p-2">{formatDollar(coin.market_cap)}</td>
                  <td className="p-2">{formatDollar(coin.total_volume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Price Comparison</h2>
        {isFetchingCharts ? (
          <Skeleton className="w-full h-[400px]" />
        ) : chartCoins.length > 0 ? (
          <MultiCoinChart coins={chartCoins} />
        ) : (
          <p className="text-muted-foreground">
            {selected.length > 0 
              ? "Loading chart data..." 
              : "Select coins above to compare their performance"}
          </p>
        )}
      </div>
    </div>
  );
}