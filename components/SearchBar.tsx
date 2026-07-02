'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from './Input'
import { searchCrypto } from '../app/actions/cryptoApi'
import { searchStocks } from '../app/actions/stockApi'
import { SearchResult } from '../types/api'
import { FiSearch, FiPlus, FiCheck } from 'react-icons/fi'
import { useWatchlist } from '../store/WatchlistContext'
import { Link } from '../i18n/routing'

export function SearchBar() {
    const t = useTranslations('Common')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { addItem, isSaved } = useWatchlist()
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsSearching(true)
                try {
                    const [cryptoRes, stockRes] = await Promise.all([
                        searchCrypto(query),
                        searchStocks(query)
                    ])
                    const combined = [...cryptoRes, ...stockRes]
                    combined.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
                    setResults(combined)
                    setIsOpen(true)
                } catch (error) {
                    console.error("Search failed", error)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setResults([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    const handleAdd = (item: SearchResult) => {
        addItem({
            id: item.id,
            type: item.type,
            symbol: item.symbol,
            name: item.name
        })
    }

    return (
        <div className="relative w-80" ref={dropdownRef}>
            <div className="relative">
                <Input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true) }}
                    className="pl-10"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute mt-2 w-[400px] -left-[40px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden z-50 backdrop-blur-xl">
                    <ul className="max-h-80 overflow-y-auto">
                        {results.map((item) => {
                            const saved = isSaved(item.id)
                            return (
                                <Link 
                                    key={item.id + item.type} 
                                    href={item.type === 'crypto' ? `/crypto/${item.id}` : '#'}
                                    className="flex items-center justify-between p-3 border-b border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full object-cover bg-white/10 p-0.5" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white font-bold">
                                                {item.symbol.substring(0, 1)}
                                            </div>
                                        )}
                                        <div className="flex flex-col overflow-hidden justify-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[var(--color-text-primary)] cursor-help" title={item.name}>{item.symbol}</span>
                                                {item.marketCap && (
                                                    <span className="text-[10px] text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                                                        MCap: {
                                                            item.marketCap >= 1e12 ? `$${(item.marketCap / 1e12).toFixed(2)}T` :
                                                            item.marketCap >= 1e9 ? `$${(item.marketCap / 1e9).toFixed(2)}B` :
                                                            item.marketCap >= 1e6 ? `$${(item.marketCap / 1e6).toFixed(2)}M` :
                                                            `$${item.marketCap.toLocaleString()}`
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pl-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'crypto' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {item.type === 'crypto' ? 'Crypto' : 'Stock'}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleAdd(item)
                                            }}
                                            disabled={saved}
                                            className={`p-1.5 rounded-full cursor-pointer transition-colors ${saved ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black'}`}
                                            title={saved ? t('add') : t('add')}
                                        >
                                            {saved ? <FiCheck size={16} /> : <FiPlus size={16} />}
                                        </button>
                                    </div>
                                </Link>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}
