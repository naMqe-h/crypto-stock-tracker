export type AssetType = 'crypto' | 'stock'

export interface SearchResult {
    id: string
    symbol: string
    name: string
    type: AssetType
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
}
