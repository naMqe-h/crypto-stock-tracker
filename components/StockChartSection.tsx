'use client'

import { useState, useEffect } from 'react'
import { Chart } from './Chart'
import { TimeframeSelector, Timeframe } from './TimeframeSelector'
import { getStockHistory } from '../app/actions/stockApi'
import { ChartData } from '../types/api'
import { useTranslations } from 'next-intl'

interface StockChartSectionProps {
    symbol: string
}

export function StockChartSection({ symbol }: StockChartSectionProps) {
    const t = useTranslations('AssetDetails')
    const [timeframe, setTimeframe] = useState<Timeframe>('30')
    const [data, setData] = useState<ChartData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        setIsLoading(true)

        getStockHistory(symbol, timeframe)
            .then(history => {
                if (mounted) {
                    setData(history)
                    setIsLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                if (mounted) setIsLoading(false)
            })

        return () => { mounted = false }
    }, [symbol, timeframe])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{t('priceChart')}</h3>
                <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
            </div>

            <div className="h-[400px] w-full relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-background)]/50 backdrop-blur-sm rounded-2xl">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {data.length > 0 ? (
                    <Chart data={data} />
                ) : (
                    !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-secondary)]">
                            No chart data available
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
