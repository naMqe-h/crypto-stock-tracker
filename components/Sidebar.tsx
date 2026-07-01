import { useTranslations } from 'next-intl'
import { Link } from '../i18n/routing'

export function Sidebar() {
    const t = useTranslations('Navigation')

    return (
        <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-surface-hover)] hidden md:flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">
                    {t('title')}
                </h2>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Link
                    href="/"
                    className="block px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    {t('crypto')}
                </Link>
                <Link
                    href="/"
                    className="block px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    {t('stocks')}
                </Link>
            </nav>
        </aside>
    )
}
