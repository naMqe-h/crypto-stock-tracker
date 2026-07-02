'use server'

import YahooFinance from 'yahoo-finance2'
import { NewsArticle } from '../../types/api'

const yahooFinance = new YahooFinance()

export async function getAssetNews(query: string): Promise<NewsArticle[]> {
    if (!query) return []
    try {
        const results = await yahooFinance.search(query, {
            quotesCount: 0,
            newsCount: 6,
            enableFuzzyQuery: true
        })

        if (!results.news || results.news.length === 0) return []

        return results.news.map((item: any) => {
            const date = item.providerPublishTime instanceof Date ? item.providerPublishTime : new Date(item.providerPublishTime || Date.now())
            return {
                id: item.uuid,
                title: item.title,
                publisher: item.publisher,
                link: item.link,
                publishTime: date.toISOString(),
                thumbnail: item.thumbnail?.resolutions?.[0]?.url || ''
            }
        })
    } catch (error) {
        console.error(`Error fetching news for ${query}:`, error)
        return []
    }
}
