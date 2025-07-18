import { formatChange, formatDollar, formatPrice } from "@/lib/formatters";
import type { MarketData } from "@/types/market";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<MarketData>[] = [
  {
    accessorKey: "name",
    header: "Coin",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "current_price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("current_price"));
      const formatted = formatPrice(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: "24h%",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price_change_percentage_24h"));
      const formatted = formatChange(amount);
      return (
        <div className={amount > 0 ? "text-green-500" : "text-red-500"}>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "market_cap",
    header: () => <div className="text-right">Market Cap</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("market_cap"));
      const formatted = formatDollar(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
