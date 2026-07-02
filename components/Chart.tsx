'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, AreaSeries, CandlestickSeries, HistogramSeries, Time } from 'lightweight-charts'
import { ChartData } from '../types/api'

interface ChartProps {
    data: ChartData[]
    type?: 'area' | 'candlestick'
}

export function Chart({ data, type = 'candlestick' }: ChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }

        const isPositive = data.length >= 2 && (data[data.length - 1].value || 0) >= (data[0].value || 0)
        const lineColor = isPositive ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)'
        const topColor = isPositive ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)'

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255, 255, 255, 0.6)',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: 'rgba(255, 255, 255, 0.1)'
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)'
            }
        })

        const uniqueData = Array.from(new Map(data.map(item => [item.time, item])).values())
        uniqueData.sort((a, b) => (a.time as number) - (b.time as number))

        if (type === 'area') {
            const areaSeries = chart.addSeries(AreaSeries, {
                lineColor,
                topColor,
                bottomColor: 'rgba(0, 0, 0, 0)',
                lineWidth: 2,
            })
            areaSeries.setData(uniqueData.map(item => ({
                time: item.time as Time,
                value: item.value || 0
            })))
        } else {
            const candleSeries = chart.addSeries(CandlestickSeries, {
                upColor: 'rgba(74, 222, 128, 1)',
                downColor: 'rgba(248, 113, 113, 1)',
                borderVisible: false,
                wickUpColor: 'rgba(74, 222, 128, 1)',
                wickDownColor: 'rgba(248, 113, 113, 1)'
            })
            candleSeries.setData(uniqueData.map(item => ({
                time: item.time as Time,
                open: item.open || item.value || 0,
                high: item.high || item.value || 0,
                low: item.low || item.value || 0,
                close: item.close || item.value || 0
            })))
        }

        const hasVolume = uniqueData.some(item => item.volume !== undefined && item.volume > 0)
        if (hasVolume) {
            const volumeSeries = chart.addSeries(HistogramSeries, {
                color: 'rgba(255, 255, 255, 0.1)',
                priceFormat: { type: 'volume' },
                priceScaleId: '',
            })

            chart.priceScale('').applyOptions({
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            })

            volumeSeries.setData(uniqueData.map(item => {
                const isUp = (item.close || item.value || 0) >= (item.open || item.value || 0)
                return {
                    time: item.time as Time,
                    value: item.volume || 0,
                    color: isUp ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'
                }
            }))
        }

        chartRef.current = chart

        chart.timeScale().fitContent()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [data, type])

    return (
        <div className="w-full h-[400px]" ref={chartContainerRef} />
    )
}
