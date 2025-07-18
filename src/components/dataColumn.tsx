import {
  formatChange,
  formatDollar,
  formatNumber,
  formatPrice,
} from "@/lib/formatters";
import type { MarketData } from "@/types/market";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<MarketData>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <div className="flex items-center">
          <span className="font-semibold">Name</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const { name, symbol, image } = row.original;
      return (
        <div className="flex items-center gap-3">
          <img src={image} alt={name} className="h-6 w-6 rounded-full" />
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground uppercase">
              {symbol}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "current_price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {formatPrice(parseFloat(row.getValue("current_price")))}
      </div>
    ),
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        24h% <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("price_change_percentage_24h"));
      return (
        <div
          className={`text-center font-medium ${
            value >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {formatChange(value)}
        </div>
      );
    },
  },
  {
    accessorKey: "market_cap",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Market Cap <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {formatDollar(parseFloat(row.getValue("market_cap")))}
      </div>
    ),
  },
  {
    accessorKey: "total_volume",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Volume (24h) <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {formatDollar(parseFloat(row.getValue("total_volume")))}
      </div>
    ),
  },
  {
    accessorKey: "circulating_supply",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Circulating Supply <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("circulating_supply"));
      return <div className="text-center">{formatNumber(value)}</div>;
    },
  },
  {
    accessorKey: "ath_change_percentage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        From ATH <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("ath_change_percentage"));
      return (
        <div className="text-center text-muted-foreground">
          {formatChange(value)}
        </div>
      );
    },
  },
];
