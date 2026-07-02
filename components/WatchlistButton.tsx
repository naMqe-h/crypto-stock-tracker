'use client'

import { useWatchlist } from '../store/WatchlistContext'
import { FiPlus, FiCheck } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { WatchlistItem } from '../store/WatchlistContext'

interface WatchlistButtonProps {
    item: WatchlistItem
}

export function WatchlistButton({ item }: WatchlistButtonProps) {
    const { addItem, isSaved } = useWatchlist()
    const t = useTranslations('Common')
    const saved = isSaved(item.id)

    return (
        <button
            onClick={() => {
                if (!saved) addItem(item)
            }}
            disabled={saved}
            title={saved ? t('saved', { fallback: 'Saved' }) : t('addToWatchlist', { fallback: 'Add to Watchlist' })}
            className={`flex items-center justify-center p-3 rounded-full transition-all cursor-pointer ${
                saved 
                ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] cursor-default shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black shadow-[0_0_10px_rgba(74,222,128,0.2)]'
            }`}
        >
            {saved ? <FiCheck size={24} /> : <FiPlus size={24} />}
        </button>
    )
}
