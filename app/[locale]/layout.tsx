import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import '../globals.css'

import { Topbar } from '../../components/Topbar'
import { WatchlistProvider } from '../../store/WatchlistContext'

export const metadata: Metadata = {
    title: 'Crypto & Stocks Tracker',
    description: 'Track your favorite crypto and stocks'
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const { locale } = await params

    if (!routing.locales.includes(locale as any)) {
        notFound()
    }

    setRequestLocale(locale)
    const messages = await getMessages()

    return (
        <html lang={locale} className="dark">
            <body className="h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] antialiased flex flex-col relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/10 blur-[120px] pointer-events-none" />

                <NextIntlClientProvider messages={messages}>
                    <WatchlistProvider>
                        <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
                            <Topbar />
                            <main className="flex-1 overflow-y-auto w-full">
                                {children}
                            </main>
                        </div>
                    </WatchlistProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
