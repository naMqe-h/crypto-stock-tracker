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
    value: number
}

export interface CryptoDetails extends AssetPrice {
    description?: string
    homepage?: string
    high24h?: number
    low24h?: number
    circulatingSupply?: number
    totalSupply?: number
}
