import { fetchCoinData, fetchCoinList, fetchMarketData } from "@/lib/api";
import type { Coin, CoinData } from "@/types/coinData";
import type { MarketData } from "@/types/marketData";
import { create } from "zustand";

const now = () => Date.now();
const FRESHNESS = {
  marketData: 5 * 60 * 1000,
  coinList: 60 * 60 * 1000,
  coinData: 3 * 60 * 1000,
};

type Store = {
  marketData: MarketData[];
  marketFetchedAt: number | null;

  coinList: Coin[];
  coinListFetchedAt: number | null;

  coinData: CoinData | null;
  coinDataFetchedAt: number | null;

  multiCoinData: Record<string, { data: CoinData; fetchedAt: number }>;

  loading: boolean;

  getMarketData: () => Promise<void>;
  getCoinList: () => Promise<void>;
  getCoinData: (coinId: string) => Promise<CoinData>;
  getMultiCoinData: (coinIds: string[]) => Promise<Record<string, CoinData>>;

  findCoinId: (query: string) => string | null;
};

export const useCryptoStore = create<Store>((set, get) => ({
  marketData: [],
  marketFetchedAt: null,

  coinList: [],
  coinListFetchedAt: null,

  coinData: null,
  coinDataFetchedAt: null,

  multiCoinData: {},

  loading: false,

  getMarketData: async () => {
    const { marketFetchedAt } = get();
    const fresh =
      marketFetchedAt && now() - marketFetchedAt < FRESHNESS.marketData;
    if (fresh) return;

    set({ loading: true });
    try {
      const data = await fetchMarketData();
      set({ marketData: data, marketFetchedAt: now() });
    } catch (err) {
      console.error("Market data error", err);
    } finally {
      set({ loading: false });
    }
  },

  getCoinList: async () => {
    const { coinListFetchedAt } = get();
    const fresh =
      coinListFetchedAt && now() - coinListFetchedAt < FRESHNESS.coinList;
    if (fresh) return;

    set({ loading: true });
    try {
      const data = await fetchCoinList();
      set({ coinList: data, coinListFetchedAt: now() });
    } catch (err) {
      console.error("Coin list error", err);
    } finally {
      set({ loading: false });
    }
  },

  getCoinData: async (coinId: string) => {
    const { coinDataFetchedAt, coinData } = get();
    const fresh =
      coinDataFetchedAt && now() - coinDataFetchedAt < FRESHNESS.coinData && coinData?.id === coinId;  
    if (fresh && coinData) return coinData;

    set({ loading: true });
    try {
      const data = await fetchCoinData(coinId);
      set({ coinData: data, coinDataFetchedAt: now() });
      return data;
    } catch (err) {
      console.error("Coin data error", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getMultiCoinData: async (coinIds: string[]) => {
    const { multiCoinData } = get();
    const results: Record<string, CoinData> = {};

    const nowTime = now();
    const toFetch = coinIds.filter((id) => {
      const entry = multiCoinData[id];
      return !entry || nowTime - entry.fetchedAt > FRESHNESS.coinData;
    });

    await Promise.all(
      toFetch.map(async (id) => {
        try {
          const data = await fetchCoinData(id);
          results[id] = data;
          set((state) => ({
            multiCoinData: {
              ...state.multiCoinData,
              [id]: { data, fetchedAt: now() },
            },
          }));
        } catch (err) {
          console.error(`Failed to fetch data for ${id}`, err);
        }
      })
    );

    for (const id of coinIds) {
      if (!results[id] && multiCoinData[id]) {
        results[id] = multiCoinData[id].data;
      }
    }

    return results;
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
