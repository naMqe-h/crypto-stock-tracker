import { getCryptoDetails } from '../../../../app/actions/cryptoApi'
import { notFound } from 'next/navigation'
import { CryptoChartSection } from '../../../../components/CryptoChartSection'
import { NewsFeed } from '../../../../components/NewsFeed'
import { getTranslations, getFormatter } from 'next-intl/server'

interface PageProps {
    params: Promise<{ id: string, locale: string }>
}

export default async function CryptoDetailsPage({ params }: PageProps) {
    const { id, locale } = await params
    const details = await getCryptoDetails(id)
    const t = await getTranslations('AssetDetails')
    const format = await getFormatter()

    if (!details) {
        notFound()
    }

    const isPositive = details.change24h >= 0

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-[var(--color-surface)]/40 p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-6">
                    <img src={details.image} alt={details.name} className="w-20 h-20 rounded-full bg-white/5 p-1" />
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-white tracking-tight">{details.name}</h1>
                            <span className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-semibold text-[var(--color-text-secondary)]">
                                {details.symbol}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-4 mt-2">
                            <span className="text-3xl font-medium text-[var(--color-text-primary)]">
                                ${details.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </span>
                            <span className={`text-lg font-medium px-2 py-0.5 rounded-md ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {isPositive ? '+' : ''}{details.change24h?.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>


            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label={t('marketCap')} value={details.marketCap ? format.number(details.marketCap, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }) : 'N/A'} />
                <StatCard label={t('volume24h')} value={details.volume24h ? format.number(details.volume24h, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }) : 'N/A'} />
                <StatCard label={t('circulatingSupply')} value={details.circulatingSupply ? format.number(details.circulatingSupply, { notation: 'compact', maximumFractionDigits: 2 }) : 'N/A'} />
                <StatCard label={t('totalSupply')} value={details.totalSupply ? format.number(details.totalSupply, { notation: 'compact', maximumFractionDigits: 2 }) : 'N/A'} />
                <StatCard label={t('high24h')} value={details.high24h ? format.number(details.high24h, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : 'N/A'} />
                <StatCard label={t('low24h')} value={details.low24h ? format.number(details.low24h, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : 'N/A'} />
                <StatCard label={t('ath')} value={details.ath ? format.number(details.ath, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : 'N/A'} />
                <StatCard label={t('atl')} value={details.atl ? format.number(details.atl, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : 'N/A'} />
            </div>

            <CryptoChartSection id={details.id} />

            {details.description && (
                <div className="bg-[var(--color-surface)]/40 p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] backdrop-blur-xl">
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('about')} {details.name}</h3>
                    <div
                        className="text-[var(--color-text-secondary)] leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: details.description }}
                    />
                </div>
            )}

            <NewsFeed query={details.name} />
        </div>
    )
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-[var(--color-surface)]/40 p-5 rounded-2xl border border-[var(--color-border)] backdrop-blur-md">
            <div className="text-sm text-[var(--color-text-secondary)] mb-1">{label}</div>
            <div className="text-lg font-semibold text-[var(--color-text-primary)]">{value}</div>
        </div>
    )
}
