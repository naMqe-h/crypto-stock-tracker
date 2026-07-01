import { setRequestLocale } from 'next-intl/server'
import { routing } from '../../i18n/routing'
import { WatchlistView } from '../../components/WatchlistView'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: { params: { locale: string } }) {
    const { locale } = await params
    setRequestLocale(locale)

    return (
        <div className="flex flex-col gap-12 w-full pb-16 pt-4">
            <WatchlistView />
        </div>
    )
}
