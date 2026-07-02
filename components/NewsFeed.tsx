'use client'

import { useState, useEffect } from 'react'
import { NewsArticle } from '../types/api'
import { getAssetNews } from '../app/actions/newsApi'
import { useTranslations, useLocale } from 'next-intl'

interface NewsFeedProps {
    query: string
}

export function NewsFeed({ query }: NewsFeedProps) {
    const t = useTranslations('NewsFeed')
    const locale = useLocale()
    const [news, setNews] = useState<NewsArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        setIsLoading(true)

        getAssetNews(query)
            .then(data => {
                if (isMounted) {
                    setNews(data)
                    setIsLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                if (isMounted) setIsLoading(false)
            })

        return () => { isMounted = false }
    }, [query])

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return new Intl.DateTimeFormat(locale, {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date)
        } catch {
            return dateString
        }
    }

    return (
        <div className="flex flex-col gap-6 mt-12 mb-12">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('title')}</h3>
            
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-[var(--color-surface)]/50 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map(article => (
                        <a 
                            key={article.id} 
                            href={article.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col bg-[var(--color-surface)]/40 border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface)]/80 transition-all group"
                        >
                            {article.thumbnail && (
                                <div className="h-40 w-full relative overflow-hidden bg-black/20">
                                    <img 
                                        src={article.thumbnail} 
                                        alt={article.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                </div>
                            )}
                            <div className="p-5 flex flex-col flex-grow">
                                <h4 className="text-[var(--color-text-primary)] font-medium text-lg leading-tight mb-4 line-clamp-3 group-hover:text-[var(--color-primary)] transition-colors">
                                    {article.title}
                                </h4>
                                <div className="mt-auto flex justify-between items-end pt-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">{article.publisher}</span>
                                        <span className="text-xs text-[var(--color-text-secondary)]">
                                            {formatDate(article.publishTime)}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t('readMore')} &rarr;
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 bg-[var(--color-surface)]/30 border border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)]">
                    {t('noNews')}
                </div>
            )}
        </div>
    )
}
