'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '../i18n/routing'
import { useTransition, useState, useRef, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const LOCALES = [
    { code: 'en', label: 'English', country: 'GB' },
    { code: 'pl', label: 'Polski', country: 'PL' }
]

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentLocale = LOCALES.find(l => l.code === locale) || LOCALES[0]

    const switchLocale = (nextLocale: string) => {
        setIsOpen(false)
        if (nextLocale === locale) return
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale })
        })
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface)]/40 backdrop-blur-md border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]/60 transition-colors cursor-pointer text-[var(--color-text-primary)] font-medium ${isPending ? 'opacity-50' : ''}`}
            >
                <img
                    src={`https://flagsapi.com/${currentLocale.country}/flat/32.png`}
                    alt={currentLocale.label}
                    className="w-6 h-6 object-contain"
                />
                <span className="hidden sm:inline">{currentLocale.label}</span>
                <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="py-1">
                        {LOCALES.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => switchLocale(l.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-primary)]/20 transition-colors cursor-pointer text-left ${locale === l.code ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'text-[var(--color-text-primary)]'}`}
                            >
                                <img
                                    src={`https://flagsapi.com/${l.country}/flat/32.png`}
                                    alt={l.label}
                                    className="w-6 h-6 object-contain"
                                />
                                <span className="font-medium">{l.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
