import { fetchMarketData } from '@/lib/api'
import type { MarketData } from '@/types/market'
import { create } from 'zustand'

type Store = {
    marketData:MarketData[]
    loading: boolean
    getMarketData: ()=>Promise<void>
}

export const useCryptoStore = create<Store>()((set) => ({
    marketData: [] as MarketData[],
    loading: false,

    getMarketData: async ()=>{
        set({loading:true})
        try {
            const data = await fetchMarketData()
            set({marketData: data})
        } catch (error) {
            console.log(error)
        } finally{
            set({loading:false})
        }
    }

}))