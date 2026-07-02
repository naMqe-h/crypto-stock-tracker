import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getTopStocks } from '../../actions/stockApi'
import { AssetsTable } from '../../../components/AssetsTable'

import { Pagination } from '../../../components/Pagination'

export default async function StocksPage({
    params,
    searchParams
}: {
    params: { locale: string }
    searchParams: { page?: string }
}) {
    const { locale } = await params
    setRequestLocale(locale)

    const resolvedSearchParams = await searchParams
    let currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page, 10) : 1

    if (currentPage > 10) currentPage = 10
    if (currentPage < 1) currentPage = 1

    const t = await getTranslations('Dashboard')

    const topStocks100 = await getTopStocks(1)

    const localPageIndex = currentPage - 1
    const topStocks = topStocks100.slice(localPageIndex * 10, localPageIndex * 10 + 10)

    const hasNextPage = topStocks.length === 10 && currentPage < 10
    const startIndex = (currentPage - 1) * 10 + 1

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6">
            <AssetsTable title={t('topStocks')} assets={topStocks} type="stock" startIndex={startIndex} />
            <Pagination currentPage={currentPage} hasNextPage={hasNextPage} />
        </div>
    )
}
