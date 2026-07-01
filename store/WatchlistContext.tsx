'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type AssetType = 'crypto' | 'stock'

export interface WatchlistItem {
    id: string
    type: AssetType
    symbol: string
    name: string
}

interface WatchlistContextType {
    items: WatchlistItem[]
    addItem: (item: WatchlistItem) => void
    removeItem: (id: string) => void
    isSaved: (id: string) => boolean
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WatchlistItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        try {
            const saved = localStorage.getItem('crypto_stock_tracker_watchlist')
            if (saved) {
                setItems(JSON.parse(saved))
            }
        } catch (error) {
            console.error('Failed to load watchlist from localStorage', error)
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('crypto_stock_tracker_watchlist', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (item: WatchlistItem) => {
        setItems(prev => {
            if (prev.some(i => i.id === item.id)) return prev
            return [...prev, item]
        })
    }

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const isSaved = (id: string) => {
        return items.some(item => item.id === id)
    }

    return (
        <WatchlistContext.Provider value={{ items, addItem, removeItem, isSaved }}>
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist() {
    const context = useContext(WatchlistContext)
    if (context === undefined) {
        throw new Error('useWatchlist must be used within a WatchlistProvider')
    }
    return context
}
