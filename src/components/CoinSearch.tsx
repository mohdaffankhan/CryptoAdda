import { useCryptoStore } from "@/store/useCryptoStore";
import { useNavigate } from "@tanstack/react-router";
import { type ComponentProps, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CoinSearchProps extends ComponentProps<"form"> {
}

export default function CoinSearch({ className, ...props }: CoinSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { getCoinList, coinList, findCoinId } = useCryptoStore();

  useEffect(() => {
    if (coinList.length === 0) getCoinList();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coinId = findCoinId(query.trim());
    if (coinId) {
      navigate({ to: `/coin/${coinId}` });
      setQuery("");
    } else {
      alert("Coin not found");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-md bg-muted/70 backdrop-blur-md border border-border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-ring transition-all duration-200 ${className}`}
      {...props}
    >
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search coins..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-9 pr-20 bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground text-sm py-5 h-10"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute right-2 h-7 px-3 text-sm font-medium hover:bg-primary/90"
      >
        Search
      </Button>
    </form>
  );
}