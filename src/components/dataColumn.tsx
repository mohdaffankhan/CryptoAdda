import {
  formatChange,
  formatDollar,
  formatNumber,
  formatPrice,
} from "@/lib/formatters";
import type { MarketData } from "@/types/marketData";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { BookmarkButton } from "./Bookmark";

export const columns: ColumnDef<MarketData>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-semibold">Name</span>,
    cell: ({ row }) => {
      const { name, symbol, image } = row.original;
      return (
        <div className="flex items-center gap-3 min-w-[150px]">
          <img
            src={image}
            alt={name}
            className="h-6 w-6 rounded-full object-cover"
            loading="lazy"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-foreground truncate">{name}</span>
            <span className="text-xs text-muted-foreground uppercase">
              {symbol}
            </span>
          </div>
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "current_price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs whitespace-nowrap"
      >
        Price <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-foreground whitespace-nowrap">
        {formatPrice(row.getValue("current_price"))}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs whitespace-nowrap"
      >
        24h % <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("price_change_percentage_24h");
      const change = parseFloat(value);
      return (
        <div
          className={`text-center font-medium whitespace-nowrap ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {formatChange(change)}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "market_cap",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs whitespace-nowrap hidden sm:inline-flex"
      >
        Market Cap <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-foreground whitespace-nowrap hidden sm:block">
        {formatDollar(row.getValue("market_cap"))}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "total_volume",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs whitespace-nowrap hidden md:inline-flex"
      >
        Volume (24h) <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center text-foreground whitespace-nowrap hidden md:block">
        {formatDollar(row.getValue("total_volume"))}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "circulating_supply",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs whitespace-nowrap hidden lg:inline-flex"
      >
        Circulating Supply <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center text-foreground whitespace-nowrap hidden lg:block">
        {formatNumber(row.getValue("circulating_supply"))}
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: "ath_change_percentage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs whitespace-nowrap hidden xl:inline-flex"
      >
        From ATH <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground whitespace-nowrap hidden xl:block">
        {formatChange(row.getValue("ath_change_percentage"))}
      </div>
    ),
    size: 120,
  },
  {
    id: "bookmark",
    header: () => <div className="text-center">Bookmark</div>,
    cell: ({ row }) => {
      const coinId = row.original.id;
      return (
        <div className="flex justify-center">
          <BookmarkButton coinId={coinId} />
        </div>
      );
    },
    enableSorting: false,
    size: 100,
  },
];