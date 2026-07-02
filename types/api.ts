export type AssetType = 'crypto' | 'stock' | "mixed"

export interface SearchResult {
    id: string
    symbol: string
    name: string
    type: AssetType
    image?: string
    marketCap?: number
}

export interface AssetPrice {
    id: string
    symbol: string
    name?: string
    price: number
    change24h: number
    image?: string
    marketCap?: number
    volume24h?: number
    type?: AssetType
}

export interface ChartData {
    time: number | string
    value?: number
    open?: number
    high?: number
    low?: number
    close?: number
    volume?: number
}

export interface AssetDetails extends AssetPrice {
    description?: string
    homepage?: string
    high24h?: number
    low24h?: number
    circulatingSupply?: number
    totalSupply?: number
    sharesOutstanding?: number
    peRatio?: number
    dividendYield?: number
    fiftyTwoWeekHigh?: number
    fiftyTwoWeekLow?: number
    ath?: number
    atl?: number
}
