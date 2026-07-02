'use client'

import { useTranslations } from 'next-intl'
import { Link } from '../i18n/routing'

export function NotFoundView({ type = 'asset' }: { type?: 'asset' | 'page' }) {
    const t = useTranslations(type === 'asset' ? 'NotFoundAsset' : 'NotFoundPage')
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-fade-in w-full">
            <div className="w-24 h-24 mb-6 rounded-full bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 flex items-center justify-center text-[var(--color-danger)] text-4xl shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                404
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{t('title')}</h1>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
                {t('description')}
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold rounded-xl hover:bg-[var(--color-primary)] hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all"
            >
                {t('goHome')}
            </Link>
        </div>
    )
}
