import type { Coin, CoinData } from "@/types/coinData";
import type { MarketData } from "@/types/marketData";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
  },
});

export const fetchMarketData = async (): Promise<MarketData[]> => {
  const res = await axiosInstance.get("/coins/markets", {
    params: {
      vs_currency: "usd",
    },
  });
  return res.data;
};

export const fetchCoinList = async (): Promise<Coin[]> => {
  const res = await axiosInstance.get("/coins/list");
  return res.data;
};

export const fetchCoinData = async (coinId: string): Promise<CoinData> => {
  const res = await axiosInstance.get(`/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: "usd",
      days: "7",
    },
  });
  return res.data;
};
