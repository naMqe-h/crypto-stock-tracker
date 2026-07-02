'use server'

import { SearchResult, AssetPrice } from '../../types/api'
import YahooFinance from 'yahoo-finance2'

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

export async function getStockPrice(symbol: string, name?: string, image?: string): Promise<AssetPrice | null> {
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
}

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
