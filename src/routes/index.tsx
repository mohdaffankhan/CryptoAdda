import { useEffect } from "react";
import { useCryptoStore } from "@/store/useCryptoStore";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dataColumn";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  {
    const { marketData, getMarketData, loading } = useCryptoStore();

    useEffect(() => {
      getMarketData();
    }, []);

    return (
      <div className="min-h-screen dark:bg-black dark:text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">📈 Today's Market Overview</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading market data...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <DataTable columns={columns} data={marketData} />
          </div>
        )}
      </div>
    </div>
    );
  }
}
