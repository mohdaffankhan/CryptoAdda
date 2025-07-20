export interface CoinData{
  id: string;
  prices: [timestamp: number, price: number][];
  market_caps: [timestamp: number, marketCap: number][];
  total_volumes: [timestamp: number, volume: number][];
}

export type Coin = {
  id: string;
  name: string;
  symbol: string;
}