import { setRequestLocale } from 'next-intl/server'
import { routing } from '../../i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: { params: { locale: string } }) {
    const { locale } = await params
    setRequestLocale(locale)

    return (
        <div className="flex flex-col flex-1 items-center justify-center p-8">
        </div>
    )
}
