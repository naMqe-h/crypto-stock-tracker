'use client'

import { useTranslations } from 'next-intl'

export type Timeframe = '1' | '7' | '30' | '365' | 'max'

interface TimeframeSelectorProps {
    selected: Timeframe
    onSelect: (tf: Timeframe) => void
}

export function TimeframeSelector({ selected, onSelect }: TimeframeSelectorProps) {
    const t = useTranslations('AssetDetails.timeframes')
    const timeframes: Timeframe[] = ['1', '7', '30', '365', 'max']

    return (
        <div className="flex items-center gap-2 bg-[var(--color-surface)]/50 p-1 rounded-lg border border-[var(--color-border)] w-fit">
            {timeframes.map(tf => (
                <button
                    key={tf}
                    onClick={() => onSelect(tf)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                        selected === tf 
                        ? 'bg-[var(--color-primary)] text-black font-semibold' 
                        : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10'
                    }`}
                >
                    {t(tf)}
                </button>
            ))}
        </div>
    )
}
