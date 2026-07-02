import { useTranslations } from 'next-intl'
import { Link } from '../i18n/routing'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SearchBar } from './SearchBar'

export function Topbar() {
    const t = useTranslations('Navigation')

    return (
        <header className="h-16 bg-transparent flex items-center px-6 sticky top-0 z-50">
            <nav className="flex items-center gap-8 flex-1">
                <Link
                    href="/"
                    className="text-lg text-white hover:text-[var(--color-primary)] transition-colors font-medium hover:drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] tracking-wide"
                >
                    {t('home')}
                </Link>
                <Link
                    href="/crypto"
                    className="text-lg text-white hover:text-[var(--color-primary)] transition-colors font-medium hover:drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] tracking-wide"
                >
                    {t('crypto')}
                </Link>
                <Link
                    href="/stocks"
                    className="text-lg text-white hover:text-[var(--color-primary)] transition-colors font-medium hover:drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] tracking-wide"
                >
                    {t('stocks')}
                </Link>
            </nav>

            <div className="flex-1 flex justify-center">
                <SearchBar />
            </div>

            <div className="flex-1 flex items-center justify-end gap-4">
                <LanguageSwitcher />
            </div>
        </header>
    )
}
