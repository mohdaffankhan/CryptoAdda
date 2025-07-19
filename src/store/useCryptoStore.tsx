import { fetchCoinData, fetchCoinList, fetchMarketData } from "@/lib/api";
import type { Coin, CoinData } from "@/types/coinData";
import type { MarketData } from "@/types/marketData";
import { create } from "zustand";

type Store = {
  marketData: MarketData[];
  coinData: CoinData[] | null;
  coinList: Coin[];
  loading: boolean;

  getMarketData: () => Promise<void>;
  getCoinData: (coinId: string) => Promise<void>;
  getCoinList: () => Promise<void>;
  findCoinId: (query: string) => string | null;
};

export const useCryptoStore = create<Store>((set, get) => ({
  marketData: [],
  coinData: null,
  coinList: [],
  loading: false,

  getMarketData: async () => {
    set({ loading: true });
    try {
      const data = await fetchMarketData();
      set({ marketData: data });
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      set({ loading: false });
    }
  },

  getCoinList: async () => {
    set({ loading: true });
    try {
      const data = await fetchCoinList();
      set({ coinList: data });
    } catch (error) {
      console.error("Error fetching coin list:", error);
    } finally {
      set({ loading: false });
    }
  },

  getCoinData: async (coinId: string) => {
    set({ loading: true });
    try {
      const data = await fetchCoinData(coinId);
      set({ coinData: data });
    } catch (error) {
      console.error("Error fetching coin data:", error);
    } finally {
      set({ loading: false });
    }
  },

  findCoinId: (query: string) => {
    const { coinList } = get();
    const search = query.trim().toLowerCase();
    const match = coinList.find(
      (coin) =>
        coin.name.toLowerCase() === search ||
        coin.symbol.toLowerCase() === search
    );
    return match?.id || null;
  },
}));
