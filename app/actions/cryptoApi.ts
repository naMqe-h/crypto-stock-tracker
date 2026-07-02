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
        const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&sparkline=false`, { next: { revalidate: 300 } })
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

export async function getCryptoDetails(id: string) {
    if (!id) return null
    try {
        const response = await fetch(`${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, { next: { revalidate: 300 } })
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()

        return {
            id: data.id,
            symbol: data.symbol?.toUpperCase() || '',
            name: data.name || '',
            price: data.market_data?.current_price?.usd || 0,
            change24h: data.market_data?.price_change_percentage_24h || 0,
            image: data.image?.large || data.image?.small || '',
            marketCap: data.market_data?.market_cap?.usd,
            volume24h: data.market_data?.total_volume?.usd,
            type: 'crypto' as const,
            description: data.description?.en || '',
            homepage: data.links?.homepage?.[0] || '',
            high24h: data.market_data?.high_24h?.usd,
            low24h: data.market_data?.low_24h?.usd,
            circulatingSupply: data.market_data?.circulating_supply,
            totalSupply: data.market_data?.total_supply,
            ath: data.market_data?.ath?.usd,
            atl: data.market_data?.atl?.usd
        }
    } catch (error) {
        console.error(`Error fetching crypto details for ${id}:`, error)
        return null
    }
}

export async function getCryptoHistory(id: string, days: string) {
    if (!id) return []
    try {
        const [marketRes, ohlcRes] = await Promise.all([
            fetch(`${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`, { next: { revalidate: 300 } }).catch(() => null),
            fetch(`${BASE_URL}/coins/${id}/ohlc?vs_currency=usd&days=${days}`, { next: { revalidate: 300 } }).catch(() => null)
        ])
        
        if (!marketRes || !marketRes.ok) throw new Error('Market network response was not ok')
        
        const marketData = await marketRes.json().catch(() => ({}))
        if (!marketData || !marketData.prices || !Array.isArray(marketData.prices)) {
            throw new Error('Invalid market data structure')
        }

        let ohlcData: any[] = []
        if (ohlcRes && ohlcRes.ok) {
            const parsed = await ohlcRes.json().catch(() => null)
            if (Array.isArray(parsed)) {
                ohlcData = parsed
            }
        }

        let volumeIdx = 0
        const volumes = Array.isArray(marketData.total_volumes) ? marketData.total_volumes : []

        if (ohlcData.length > 0) {
            return ohlcData.map((candle: [number, number, number, number, number]) => {
                const time = candle[0]
                
                let closestVolume = 0
                if (volumes.length > 0) {
                    let minDiff = Infinity
                    for (let i = volumeIdx; i < volumes.length; i++) {
                        const diff = Math.abs(volumes[i][0] - time)
                        if (diff < minDiff) {
                            minDiff = diff
                            closestVolume = volumes[i][1]
                            volumeIdx = i
                        } else if (diff > minDiff) {
                            break
                        }
                    }
                }

                return {
                    time: Math.floor(time / 1000),
                    open: candle[1],
                    high: candle[2],
                    low: candle[3],
                    close: candle[4],
                    value: candle[4],
                    volume: closestVolume
                }
            })
        } else {
            return marketData.prices.map((price: [number, number], i: number) => {
                const time = price[0]
                const val = price[1]
                const vol = volumes[i] ? volumes[i][1] : 0
                
                return {
                    time: Math.floor(time / 1000),
                    open: val,
                    high: val,
                    low: val,
                    close: val,
                    value: val,
                    volume: vol
                }
            })
        }
    } catch (error) {
        console.error(`Error fetching history for ${id} (days=${days}):`, error)
        return []
    }
}
