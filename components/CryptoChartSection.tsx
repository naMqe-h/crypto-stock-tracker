'use client'

import { useState, useEffect } from 'react'
import { Chart } from './Chart'
import { TimeframeSelector, Timeframe } from './TimeframeSelector'
import { getCryptoHistory } from '../app/actions/cryptoApi'
import { ChartData } from '../types/api'
import { useTranslations } from 'next-intl'

interface CryptoChartSectionProps {
    id: string
}

export function CryptoChartSection({ id }: CryptoChartSectionProps) {
    const t = useTranslations('AssetDetails')
    const [timeframe, setTimeframe] = useState<Timeframe>('30')
    const [chartType, setChartType] = useState<'area' | 'candlestick'>('candlestick')
    const [data, setData] = useState<ChartData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        setIsLoading(true)

        const fetchData = async () => {
            try {
                const history = await getCryptoHistory(id, timeframe)
                if (isMounted) {
                    setData(history)
                }
            } catch (error) {
                console.error("Failed to load chart data:", error)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [id, timeframe])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{t('priceChart')}</h3>
                <div className="flex gap-2 items-center">
                    <div className="flex bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
                        <button
                            onClick={() => setChartType('area')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                chartType === 'area'
                                    ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] cursor-pointer'
                                    : 'text-[var(--color-text-secondary)] hover:text-white cursor-pointer'
                            }`}
                        >
                            Line
                        </button>
                        <button
                            onClick={() => setChartType('candlestick')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                chartType === 'candlestick'
                                    ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] cursor-pointer'
                                    : 'text-[var(--color-text-secondary)] hover:text-white cursor-pointer'
                            }`}
                        >
                            Candle
                        </button>
                    </div>
                    <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
                </div>
            </div>

            <div className="bg-[var(--color-surface)]/40 border border-[var(--color-border)] rounded-2xl p-4 min-h-[432px] relative backdrop-blur-md">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-background)]/50 backdrop-blur-sm rounded-2xl">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {data.length > 0 ? (
                    <Chart data={data} type={chartType} />
                ) : (
                    !isLoading && <div className="flex items-center justify-center h-[400px] text-[var(--color-text-secondary)]">No data available</div>
                )}
            </div>
        </div>
    )
}
