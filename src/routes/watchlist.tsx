import { getWatchList } from "@/lib/localstorage";
import { useCryptoStore } from "@/store/useCryptoStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dataColumn";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StarIcon, RefreshCw } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
});

function WatchlistPage() {
  const navigate = useNavigate();
  const { 
    loading, 
    marketData, 
    getMarketData, 
    marketError: error,
    refreshAll,
    isRefreshing
  } = useCryptoStore();

  useEffect(() => {
    getMarketData();
  }, [getMarketData]);

  const watchlistIds = getWatchList();
  const bookmarkedCoins = useMemo(() => {
    return marketData.filter((coin) => watchlistIds.includes(coin.id));
  }, [marketData, watchlistIds]);

  const handleRetry = () => {
    refreshAll();
  };

  const handleExplore = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <StarIcon className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                Your Watchlist
              </span>
            </h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRetry}
            disabled={loading || isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {error ? (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-2 w-fit"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : loading && !isRefreshing ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : bookmarkedCoins.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 border rounded-lg bg-muted/50">
            <StarIcon className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">Your watchlist is empty</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You haven't added any coins to your watchlist yet. Explore the market and add some coins to track.
            </p>
            <Button onClick={handleExplore} className="mt-4">
              Explore Cryptocurrencies
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <DataTable 
              columns={columns} 
              data={bookmarkedCoins} 
              loading={isRefreshing}
            />
          </div>
        )}
      </div>
    </div>
  );
}