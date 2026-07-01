'use client'

import { AssetPrice } from '../types/api'
import { useWatchlist } from '../store/WatchlistContext'

import { useState } from 'react'
import { useTranslations, useFormatter } from 'next-intl'

interface AssetsTableProps {
    title?: string
    assets: AssetPrice[]
    type: 'crypto' | 'stock'
    startIndex?: number
}

export function AssetsTable({ title, assets, type, startIndex = 1 }: AssetsTableProps) {
    const { isSaved, addItem, removeItem } = useWatchlist()
    const t = useTranslations('Table')
    const format = useFormatter()
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

    const handleToggleWatchlist = (asset: AssetPrice) => {
        if (isSaved(asset.id)) {
            removeItem(asset.id)
        } else {
            addItem({
                id: asset.id,
                type: type,
                symbol: asset.symbol,
                name: asset.name || asset.symbol
            })
        }
    }

    return (
        <div className="w-full">
            <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
                                <th className="px-4 py-2 text-text-secondary font-medium w-16 text-center">{t('index')}</th>
                                <th className="px-4 py-2 text-text-secondary font-medium">{t('asset')}</th>
                                <th className="px-4 py-2 text-text-secondary font-medium text-right">{t('price')}</th>
                                <th className="px-4 py-2 text-text-secondary font-medium text-right">{t('change24h')}</th>
                                <th className="px-4 py-2 text-text-secondary font-medium text-right whitespace-nowrap">{t('marketCap')}</th>
                                <th className="px-4 py-2 text-text-secondary font-medium text-right whitespace-nowrap">{t('volume24h')}</th>
                                <th className="px-4 py-2 text-center text-text-secondary font-medium">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset, index) => {
                                const isPositive = asset.change24h >= 0
                                const saved = isSaved(asset.id)
                                return (
                                    <tr key={asset.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-hover)]/30 transition-colors">
                                        <td className="px-4 py-2 text-center text-[var(--color-text-secondary)] font-medium">
                                            {startIndex + index}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-3">
                                                {asset.image && !imageErrors[asset.id] ? (
                                                    <img 
                                                        src={asset.image} 
                                                        alt={asset.name} 
                                                        className="w-8 h-8 rounded-full object-cover" 
                                                        onError={() => setImageErrors(prev => ({ ...prev, [asset.id]: true }))}
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center font-bold text-xs text-[var(--color-primary)]">
                                                        {asset.symbol.substring(0, 2)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-[var(--color-text-primary)]">{asset.symbol}</div>
                                                    <div className="text-sm text-text-secondary">{asset.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-right font-medium">
                                            {format.number(asset.price, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className={`px-4 py-2 text-right font-medium ${isPositive ? 'text-[var(--color-primary)]' : 'text-[var(--color-danger)]'}`}>
                                            {isPositive ? '+' : ''}{format.number(asset.change24h / 100, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-2 text-right font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                                            {asset.marketCap ? format.number(asset.marketCap, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }) : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-right font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                                            {asset.volume24h ? format.number(asset.volume24h, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }) : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleToggleWatchlist(asset)}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${saved
                                                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]'
                                                    : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                                                    }`}
                                            >
                                                {saved ? t('saved') : t('add')}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {assets.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-text-secondary">
                                        {t('noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
