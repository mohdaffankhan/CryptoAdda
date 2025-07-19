import { formatDollar } from '@/lib/formatters';
import { useCryptoStore } from '@/store/useCryptoStore';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/coin/$coinId')({
   component: RouteComponent,
})

function RouteComponent() {
  const { coinId } = useParams({from: '/coin/$coinId'});
  const { loading, coinData, getCoinData } = useCryptoStore();

  useEffect(() => {
    getCoinData(coinId);
  }, [coinId]);

  if (loading || !coinData) return <p className="p-4 dark:bg-black dark:text-white">Loading...</p>;
  console.log(coinData);
 const latestPrice = coinData.prices.at(-1)?.[1];
  const latestMarketCap = coinData.market_caps.at(-1)?.[1];
  const latestVolume = coinData.total_volumes.at(-1)?.[1];

  return (
    <div className="p-6 space-y-4 text-white dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold capitalize">{coinId}</h1>

      <div className="grid gap-4 md:grid-cols-3 text-lg">
        <div className="p-4 bg-muted rounded-xl shadow">
          <p className="text-muted-foreground">Latest Price</p>
          <p className="font-semibold">{formatDollar(latestPrice)}</p>
        </div>
        <div className="p-4 bg-muted rounded-xl shadow">
          <p className="text-muted-foreground">Market Cap</p>
          <p className="font-semibold">{formatDollar(latestMarketCap)}</p>
        </div>
        <div className="p-4 bg-muted rounded-xl shadow">
          <p className="text-muted-foreground">24h Volume</p>
          <p className="font-semibold">{formatDollar(latestVolume)}</p>
        </div>
      </div>
    </div>
  );
}