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
