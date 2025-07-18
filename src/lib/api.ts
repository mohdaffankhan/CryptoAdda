import type { MarketData } from "@/types/market";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
  },
});

export const fetchMarketData = async(): Promise<MarketData[]>=>{
    const res = await axiosInstance.get('/coins/markets',{
        params: {
            vs_currency: 'usd',
        }
    })
    return res.data
}