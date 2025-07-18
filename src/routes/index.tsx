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
      <div className="p-2 dark:bg-black dark:text-white">
        <h1>Market Data</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable columns={columns} data={marketData} />
        )}
      </div>
    );
  }
}
