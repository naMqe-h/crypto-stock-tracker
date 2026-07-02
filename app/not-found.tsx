import { NextIntlClientProvider } from 'next-intl'
import { NotFoundView } from '../components/NotFoundView'
import enMessages from '../messages/en.json'
import './globals.css'

export default function NotFound() {
    return (
        <html lang="en" className="dark">
            <body className="h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] antialiased flex flex-col relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/10 blur-[120px] pointer-events-none" />
                
                <NextIntlClientProvider locale="en" messages={enMessages}>
                    <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden items-center justify-center">
                        <NotFoundView type="page" />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
