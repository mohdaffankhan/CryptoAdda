import { useCryptoStore } from "@/store/useCryptoStore";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function CoinSearch() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const { getCoinList, coinList, findCoinId } = useCryptoStore();

    useEffect(() => {
        if (coinList.length === 0) getCoinList();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const coinId = findCoinId(query);
        if (coinId) {
            navigate({ to: `/coin/${coinId}` });
        } else {
            alert("Coin not found");
        }
    };

return (
    <form onSubmit={handleSubmit}>
        <input
            className="rounded px-2 py-1 text-sm dark:bg-muted dark:text-white border"
            type="text"
            placeholder="Search coin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <button
            type="submit"
            className="bg-primary text-white text-sm px-3 py-1 rounded"
        >
            Go
        </button>
    </form>
);
}

export default CoinSearch;
