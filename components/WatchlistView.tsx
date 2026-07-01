'use client'

import { useTranslations } from 'next-intl'
import { useWatchlist } from '../store/WatchlistContext'
import { AssetsTable } from './AssetsTable'
import { useEffect, useState } from 'react'

import { getCryptoPrices } from '../app/actions/cryptoApi'
import { getStockPrices } from '../app/actions/stockApi'

export function WatchlistView() {
    const t = useTranslations('Watchlist')
    const { items } = useWatchlist()
    const [mounted, setMounted] = useState(false)
    const [liveAssets, setLiveAssets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        async function fetchLivePrices() {
            if (items.length === 0) {
                setLiveAssets([])
                return
            }
            setLoading(true)
            try {
                const cryptoIds = items.filter(i => i.type === 'crypto').map(i => i.id)
                const stockSymbols = items.filter(i => i.type === 'stock').map(i => i.symbol)

                const [cryptoData, stockData] = await Promise.all([
                    cryptoIds.length > 0 ? getCryptoPrices(cryptoIds) : Promise.resolve([]),
                    stockSymbols.length > 0 ? getStockPrices(stockSymbols) : Promise.resolve([])
                ])

                const allData = [...cryptoData, ...stockData]

                const allAssets = items.map(item => {
                    const found = allData.find(d => d.id === item.id)
                    return found || { ...item, price: 0, change24h: 0, type: item.type, marketCap: 0, volume24h: 0 }
                })

                allAssets.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))

                setLiveAssets(allAssets)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchLivePrices()
    }, [items])

    if (!mounted) return null

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-[var(--color-surface)]/20 backdrop-blur-md border border-[var(--color-border)] rounded-2xl mt-8">
                <p className="text-xl text-[var(--color-text-secondary)]">{t('empty')}</p>
            </div>
        )
    }

    return (
        <div className="mt-8 relative">
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <AssetsTable title={t('title')} assets={liveAssets} type="mixed" />
            </div>
            {loading && liveAssets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    )
}

