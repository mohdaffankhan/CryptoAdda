import { useEffect } from "react";
import { useCryptoStore } from "@/store/useCryptoStore";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dataColumn";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { 
    marketData, 
    getMarketData, 
    loading, 
    marketError: error,
    isRefreshing,
    refreshAll
  } = useCryptoStore();

  useEffect(() => {
    getMarketData();
  }, [getMarketData]);

  const handleRetry = () => {
    refreshAll();
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center sm:text-left">
            <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Today's Market Overview
            </span>
          </h1>
          
          <Button 
            variant="outline" 
            onClick={handleRetry}
            disabled={loading || isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <ReloadIcon className="h-4 w-4 animate-spin" />
            ) : (
              <ReloadIcon className="h-4 w-4" />
            )}
            Refresh Data
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
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <DataTable 
              columns={columns} 
              data={marketData} 
              className="w-full"
              loading={isRefreshing}
            />
          </div>
        )}
      </div>
    </div>
  );
}