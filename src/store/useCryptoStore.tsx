import { fetchCoinData, fetchCoinList, fetchMarketData } from "@/lib/api";
import type { Coin, CoinData } from "@/types/coinData";
import type { MarketData } from "@/types/marketData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Constants
const now = () => Date.now();
const FRESHNESS = {
  marketData: 5 * 60 * 1000, // 5 minutes
  coinList: 60 * 60 * 1000, // 1 hour
  coinData: 3 * 60 * 1000, // 3 minutes
};

type Store = {
  marketData: MarketData[];
  marketFetchedAt: number | null;
  marketError: string | null;

  coinList: Coin[];
  coinListFetchedAt: number | null;
  coinListError: string | null;

  coinData: CoinData | null;
  coinDataFetchedAt: number | null;
  coinDataError: string | null;

  multiCoinData: Record<string, { data: CoinData; fetchedAt: number }>;
  multiCoinDataErrors: Record<string, string>;

  loading: boolean;
  isRefreshing: boolean;

  getMarketData: (force?: boolean) => Promise<void>;
  getCoinList: (force?: boolean) => Promise<void>;
  getCoinData: (coinId: string, force?: boolean) => Promise<CoinData | null>;
  getMultiCoinData: (coinIds: string[], force?: boolean) => Promise<Record<string, CoinData>>;
  refreshAll: () => Promise<void>;

  findCoinId: (query: string) => string | null;
  findCoinById: (id: string) => Coin | undefined;
};

export const useCryptoStore = create<Store>()(
  persist(
    (set, get) => ({
      marketData: [],
      marketFetchedAt: null,
      marketError: null,

      coinList: [],
      coinListFetchedAt: null,
      coinListError: null,

      coinData: null,
      coinDataFetchedAt: null,
      coinDataError: null,

      multiCoinData: {},
      multiCoinDataErrors: {},

      loading: false,
      isRefreshing: false,

      getMarketData: async (force = false) => {
        const { marketFetchedAt, loading } = get();
        if (loading) return;

        const fresh =
          !force &&
          marketFetchedAt &&
          now() - marketFetchedAt < FRESHNESS.marketData;
        if (fresh) return;

        set({ loading: true, marketError: null });
        try {
          const data = await fetchMarketData();
          set({ 
            marketData: data, 
            marketFetchedAt: now(),
            marketError: null
          });
        } catch (err) {
          const error = err instanceof Error ? err.message : "Failed to fetch market data";
          set({ marketError: error });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      getCoinList: async (force = false) => {
        const { coinListFetchedAt, loading } = get();
        if (loading) return;

        const fresh =
          !force &&
          coinListFetchedAt &&
          now() - coinListFetchedAt < FRESHNESS.coinList;
        if (fresh) return;

        set({ loading: true, coinListError: null });
        try {
          const data = await fetchCoinList();
          set({ 
            coinList: data, 
            coinListFetchedAt: now(),
            coinListError: null
          });
        } catch (err) {
          const error = err instanceof Error ? err.message : "Failed to fetch coin list";
          set({ coinListError: error });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      getCoinData: async (coinId: string, force = false) => {
        const { coinDataFetchedAt, coinData, loading } = get();
        if (loading) return coinData || null;

        const fresh =
          !force &&
          coinDataFetchedAt &&
          now() - coinDataFetchedAt < FRESHNESS.coinData && 
          coinData?.id === coinId;
        if (fresh && coinData) return coinData;

        set({ loading: true, coinDataError: null });
        try {
          const data = await fetchCoinData(coinId);
          set({ 
            coinData: data, 
            coinDataFetchedAt: now(),
            coinDataError: null
          });
          return data;
        } catch (err) {
          const error = err instanceof Error ? err.message : `Failed to fetch data for ${coinId}`;
          set({ coinDataError: error });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      getMultiCoinData: async (coinIds: string[], force = false) => {
        const { multiCoinData, loading, isRefreshing } = get();
        if (loading || isRefreshing) return {};

        set({ isRefreshing: true });
        const results: Record<string, CoinData> = {};
        const errors: Record<string, string> = {};
        const nowTime = now();

        const toFetch = coinIds.filter((id) => {
          const entry = multiCoinData[id];
          return force || !entry || nowTime - entry.fetchedAt > FRESHNESS.coinData;
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
                multiCoinDataErrors: {
                  ...state.multiCoinDataErrors,
                  [id]: "",
                },
              }));
            } catch (err) {
              const error = err instanceof Error ? err.message : `Failed to fetch ${id}`;
              errors[id] = error;
              set((state) => ({
                multiCoinDataErrors: {
                  ...state.multiCoinDataErrors,
                  [id]: error,
                },
              }));
            }
          })
        );

        // Include cached data for coins that weren't fetched
        for (const id of coinIds) {
          if (!results[id] && multiCoinData[id]) {
            results[id] = multiCoinData[id].data;
          }
        }

        set({ isRefreshing: false });
        return results;
      },

      refreshAll: async () => {
        set({ isRefreshing: true });
        try {
          await Promise.all([
            get().getMarketData(true),
            get().getCoinList(true),
          ]);
        } finally {
          set({ isRefreshing: false });
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

      findCoinById: (id: string) => {
        return get().coinList.find(coin => coin.id === id);
      },
    }),
    {
      name: "crypto-store",
      partialize: (state) => ({
        coinList: state.coinList,
        coinListFetchedAt: state.coinListFetchedAt,
        multiCoinData: state.multiCoinData,
      }),
    }
  )
);