'use server'

import { SearchResult, AssetPrice } from '../../types/api'

const BASE_URL = 'https://api.coingecko.com/api/v3'

export async function searchCrypto(query: string): Promise<SearchResult[]> {
    if (!query) return []
    try {
        const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()

        const coins = (data.coins || []).slice(0, 5)
        if (coins.length === 0) return []

        const ids = coins.map((c: any) => c.id)
        const detailedCoins = await getCryptoPrices(ids)

        return detailedCoins.map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name || coin.symbol,
            type: 'crypto',
            image: coin.image,
            marketCap: coin.marketCap
        }))
    } catch (error) {
        console.error('Error fetching crypto search results:', error)
        return []
    }
}

export async function getTopCrypto(page: number = 1): Promise<AssetPrice[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`,
            { next: { revalidate: 60 } }
        )
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()

        return data.map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            image: coin.image,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume
        }))
    } catch (error) {
        console.error('Error fetching top crypto:', error)
        return []
    }
}

export async function getCryptoPrices(ids: string[]): Promise<AssetPrice[]> {
    if (!ids || ids.length === 0) return []
    try {
        const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&sparkline=false`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()

        return data.map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            image: coin.image,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            type: 'crypto'
        }))
    } catch (error) {
        console.error('Error fetching crypto prices:', error)
        return []
    }
}
