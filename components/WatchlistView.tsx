'use client'

import { useTranslations } from 'next-intl'
import { useWatchlist } from '../store/WatchlistContext'
import { AssetsTable } from './AssetsTable'
import { useEffect, useState } from 'react'

export function WatchlistView() {
    const t = useTranslations('Watchlist')
    const { items } = useWatchlist()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-[var(--color-surface)]/20 backdrop-blur-md border border-[var(--color-border)] rounded-2xl mt-8">
                <p className="text-xl text-[var(--color-text-secondary)]">{t('empty')}</p>
            </div>
        )
    }

    const savedAssets = items.map(item => ({
        ...item,
        price: 0,
        change24h: 0
    }))

    return (
        <div className="mt-8">
            <AssetsTable title={t('title')} assets={savedAssets} type="crypto" />
        </div>
    )
}
