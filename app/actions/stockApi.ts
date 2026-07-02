'use server'

import { SearchResult, AssetPrice } from '../../types/api'
import YahooFinance from 'yahoo-finance2'
import { unstable_cache } from 'next/cache'

const yahooFinance = new YahooFinance()

export async function searchStocks(query: string): Promise<SearchResult[]> {
    if (!query) return []

    try {
        const results = await yahooFinance.search(query, {
            quotesCount: 5,
            newsCount: 0,
            enableFuzzyQuery: true
        })

        const validStocks = (results.quotes || [])
            .filter(quote => quote.isYahooFinance)
            .slice(0, 5)

        if (validStocks.length === 0) return []

        const symbols = validStocks.map(stock => stock.symbol)
        const detailedStocks = await getStockPrices(symbols)

        return detailedStocks.map(stock => ({
            id: stock.symbol,
            symbol: stock.symbol,
            name: stock.name || stock.symbol,
            type: 'stock',
            image: stock.image,
            marketCap: stock.marketCap
        }))
    } catch (error) {
        console.error('Error fetching stock search results:', error)
        return []
    }
}

export const getStockPrice = unstable_cache(
    async (symbol: string, name?: string, image?: string): Promise<AssetPrice | null> => {
        if (!symbol) return null

        try {
            const quote = await yahooFinance.quote(symbol)

            return {
                id: symbol,
                symbol: symbol,
                name: name || quote.shortName || quote.longName || symbol,
                price: quote.regularMarketPrice || 0,
                change24h: quote.regularMarketChangePercent || 0,
                marketCap: quote.marketCap,
                volume24h: quote.regularMarketVolume,
                image: image || `https://companiesmarketcap.com/img/company-logos/64/${symbol.replace('.', '-')}.webp`,
                type: 'stock'
            }
        } catch (error) {
            console.error(`Error fetching stock price for ${symbol}:`, error)
            return null
        }
    },
    ['stock-price'],
    { revalidate: 300 }
)

export async function getStockPrices(symbols: string[]): Promise<AssetPrice[]> {
    if (!symbols || symbols.length === 0) return []
    try {
        const promises = symbols.map(symbol => getStockPrice(symbol))
        const results = await Promise.all(promises)
        return results.filter((res): res is AssetPrice => res !== null)
    } catch (error) {
        console.error('Error fetching multiple stock prices:', error)
        return []
    }
}

export async function getTopStocks(apiPage: number = 1): Promise<AssetPrice[]> {
    try {
        const queryOptions = {
            count: 100,
            region: 'US',
            lang: 'en-US'
        }
        const screenerResult = await yahooFinance.screener({ scrIds: 'most_actives', ...queryOptions })

        const results = screenerResult.quotes.map(quote => ({
            id: quote.symbol,
            symbol: quote.symbol,
            name: quote.shortName || quote.longName || quote.symbol,
            price: quote.regularMarketPrice || 0,
            change24h: quote.regularMarketChangePercent || 0,
            marketCap: quote.marketCap,
            volume24h: quote.regularMarketVolume,
            image: `https://companiesmarketcap.com/img/company-logos/64/${quote.symbol.replace('.', '-')}.webp`
        }))

        results.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))

        return results
    } catch (error) {
        console.error('Error fetching top stocks from Yahoo Finance:', error)
        return []
    }
}

export const getStockDetails = unstable_cache(
    async (symbol: string) => {
        if (!symbol) return null
        try {
            const quote = await yahooFinance.quote(symbol).catch(() => null)
            const quoteSummary = await yahooFinance.quoteSummary(symbol, { modules: ['assetProfile', 'summaryDetail'] }).catch(() => null)
            
            if (!quote && !quoteSummary) return null

            const profile = quoteSummary?.assetProfile
            const detail = quoteSummary?.summaryDetail

            return {
                id: symbol,
                symbol: symbol,
                name: quote?.shortName || quote?.longName || symbol,
                price: quote?.regularMarketPrice || detail?.previousClose || 0,
                change24h: quote?.regularMarketChangePercent || 0,
                image: `https://companiesmarketcap.com/img/company-logos/64/${symbol.replace('.', '-')}.webp`,
                marketCap: quote?.marketCap || detail?.marketCap,
                volume24h: quote?.regularMarketVolume || detail?.volume,
                type: 'stock' as const,
                description: profile?.longBusinessSummary || '',
                homepage: profile?.website || '',
                high24h: detail?.dayHigh || quote?.regularMarketDayHigh,
                low24h: detail?.dayLow || quote?.regularMarketDayLow,
                sharesOutstanding: detail?.sharesOutstanding || quote?.sharesOutstanding,
                peRatio: detail?.trailingPE || quote?.trailingPE,
                dividendYield: detail?.dividendYield || quote?.dividendYield,
                fiftyTwoWeekHigh: detail?.fiftyTwoWeekHigh || quote?.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: detail?.fiftyTwoWeekLow || quote?.fiftyTwoWeekLow
            }
        } catch (error) {
            console.error(`Error fetching stock details for ${symbol}:`, error)
            return null
        }
    },
    ['stock-details'],
    { revalidate: 300 }
)

export const getStockHistory = unstable_cache(
    async (symbol: string, timeframe: string) => {
        if (!symbol) return []
        try {
            let period1 = new Date()
            let interval: '15m' | '1h' | '1d' | '1wk' | '1mo' = '1d'
            const now = Date.now()

            switch (timeframe) {
                case '1': 
                    period1 = new Date(now - 1 * 24 * 60 * 60 * 1000); 
                    interval = '15m'; 
                    break;
                case '7': 
                    period1 = new Date(now - 7 * 24 * 60 * 60 * 1000); 
                    interval = '1h'; 
                    break;
                case '30': 
                    period1 = new Date(now - 30 * 24 * 60 * 60 * 1000); 
                    interval = '1d'; 
                    break;
                case '365': 
                    period1 = new Date(now - 365 * 24 * 60 * 60 * 1000); 
                    interval = '1d'; 
                    break;
                case 'max': 
                    period1 = new Date(0); 
                    interval = '1mo'; 
                    break;
            }

            const chart = await yahooFinance.chart(symbol, { period1, interval })
            
            return chart.quotes.map(q => ({
                time: Math.floor(q.date.getTime() / 1000),
                value: q.close || 0
            })).filter(q => q.value !== null && q.value !== 0)

        } catch (error) {
            console.error(`Error fetching stock history for ${symbol}:`, error)
            return []
        }
    },
    ['stock-history'],
    { revalidate: 300 }
)
