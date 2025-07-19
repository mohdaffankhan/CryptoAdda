import { getWatchList } from "@/lib/localstorage";
import { useCryptoStore } from "@/store/useCryptoStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dataColumn";

export const Route = createFileRoute("/watchlist")({
  component: RouteComponent,
});

function RouteComponent() {
  const { loading, marketData, getMarketData } = useCryptoStore();
  useEffect(() => {
    getMarketData();
  }, []);

  const watchlistIds = getWatchList();

  const bookmarkedCoins = useMemo(() => {
    return marketData.filter((coin) => watchlistIds.includes(coin.id));
  }, [marketData, watchlistIds]);

  return (
    <div className="min-h-screen dark:bg-black dark:text-white px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">📈 Watchlist</h1>
    
            {loading ? (
              <p className="text-center text-gray-400">Loading market data...</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-700">
                <DataTable columns={columns} data={bookmarkedCoins} />
              </div>
            )}
          </div>
        </div>
  );
}
